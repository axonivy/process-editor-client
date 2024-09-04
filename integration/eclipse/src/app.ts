import {
  configureServerActions,
  EnableToolPaletteAction,
  GLSPActionDispatcher,
  GLSPDiagramServer,
  TYPES,
  RequestModelAction,
  RequestTypeHintsAction
} from '@eclipse-glsp/client';
import { EnableViewportAction, SwitchThemeAction, IvyBaseJsonrpcGLSPClient, GLSPWebSocketProvider } from '@ivyteam/process-editor';
import { getParameters } from '@eclipse-glsp/ide';
import { ApplicationIdProvider, GLSPClient } from '@eclipse-glsp/protocol';

import createContainer from './di.config';
import { ShowGridAction } from '@ivyteam/process-editor/lib/diagram/grid/action-handler';
import { MessageConnection } from 'vscode-jsonrpc';

const urlParameters = getParameters();
const filePath = urlParameters.path;

// In the Eclipse Integration, port is dynamic, as multiple editors
// and/or Eclipse Servers may be running in parallel (e.g. 1/Eclipse IDE)
const port = parseInt(urlParameters.port, 10);
const applicationId = urlParameters.application;
const id = 'ivy-glsp-process';
const diagramType = 'ivy-glsp-process';

const clientId = urlParameters.client || ApplicationIdProvider.get();
const widgetId = urlParameters.widget || clientId;
setWidgetId(widgetId);
const container = createContainer(widgetId);

const diagramServer = container.get<GLSPDiagramServer>(TYPES.ModelSource);
diagramServer.clientId = clientId;

let glspClient: GLSPClient;

const webSocketUrl = `ws://localhost:${port}/${id}`;
const wsProvider = new GLSPWebSocketProvider(webSocketUrl);
wsProvider.listen({ onConnection: initialize, onReconnect: reconnect, logger: console });

async function initialize(connectionProvider: MessageConnection, isReconnecting = false): Promise<void> {
  glspClient = new IvyBaseJsonrpcGLSPClient({ id, connectionProvider });
  await diagramServer.connect(glspClient);
  const result = await glspClient.initializeServer({
    applicationId,
    protocolVersion: GLSPClient.protocolVersion
  });
  await configureServerActions(result, diagramType, container);
  await glspClient.initializeClientSession({ clientSessionId: diagramServer.clientId, diagramType });
  const actionDispatcher = container.get<GLSPActionDispatcher>(TYPES.IActionDispatcher);
  actionDispatcher
    .dispatch(
      RequestModelAction.create({
        // Java's URLEncoder.encode encodes spaces as plus sign but decodeURI expects spaces to be encoded as %20.
        // See also https://en.wikipedia.org/wiki/Query_string#URL_encoding for URL encoding in forms vs generic URL encoding.
        options: {
          sourceUri: 'file://' + decodeURI(filePath.replace(/\+/g, '%20')),
          diagramType: diagramType
        }
      })
    )
    .then(() =>
      actionDispatcher.onceModelInitialized().finally(() => {
        actionDispatcher.dispatch(RequestTypeHintsAction.create({ requestId: diagramType }));
        actionDispatcher.dispatch(EnableToolPaletteAction.create());
        actionDispatcher.dispatch(EnableViewportAction.create());
        actionDispatcher.dispatch(SwitchThemeAction.create({ theme: urlParameters.theme ?? 'light' }));
        actionDispatcher.dispatch(ShowGridAction.create({ show: urlParameters.grid === 'true' ?? true }));
      })
    );
}

async function reconnect(connectionProvider: MessageConnection): Promise<void> {
  glspClient.stop();
  initialize(connectionProvider, true /* isReconnecting */);
}

function setWidgetId(mainWidgetId: string): void {
  const mainWidget = document.getElementById('sprotty');
  if (mainWidget) {
    mainWidget.id = mainWidgetId;
  }
}
