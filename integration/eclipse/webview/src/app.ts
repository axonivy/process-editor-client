import {
  configureServerActions,
  EnableToolPaletteAction,
  GLSPActionDispatcher,
  GLSPDiagramServer,
  RequestTypeHintsAction
} from '@eclipse-glsp/client';
import { getParameters } from '@eclipse-glsp/ide';
import { ApplicationIdProvider, BaseJsonrpcGLSPClient, GLSPClient, JsonrpcGLSPClient } from '@eclipse-glsp/protocol';
import { RequestModelAction, TYPES } from 'sprotty';

import createContainer from './di.config';

const urlParameters = getParameters();
const filePath = urlParameters.path;

// In the Eclipse Integration, port is dynamic, as multiple editors
// and/or Eclipse Servers may be running in parallel (e.g. 1/Eclipse IDE)
const port = parseInt(urlParameters.port, 10);
const applicationId = urlParameters.application;
const id = 'ivy-glsp-process';
const diagramType = 'ivy-glsp-process';
const websocket = new WebSocket(`ws://localhost:${port}/${id}`);

const clientId = urlParameters.client || ApplicationIdProvider.get();
const widgetId = urlParameters.widget || clientId;
setWidgetId(widgetId);
const container = createContainer(widgetId);

const diagramServer = container.get<GLSPDiagramServer>(TYPES.ModelSource);
diagramServer.clientId = clientId;

websocket.onopen = () => {
  const connectionProvider = JsonrpcGLSPClient.createWebsocketConnectionProvider(websocket);
  const glspClient = new BaseJsonrpcGLSPClient({ id, connectionProvider });
  initialize(glspClient);
};

async function initialize(client: GLSPClient): Promise<void> {
  await diagramServer.connect(client);
  const result = await client.initializeServer({
    applicationId,
    protocolVersion: GLSPClient.protocolVersion
  });
  await configureServerActions(result, diagramType, container);

  await client.initializeClientSession({ clientSessionId: diagramServer.clientId, diagramType });
  const actionDispatcher = container.get<GLSPActionDispatcher>(TYPES.IActionDispatcher);
  actionDispatcher.dispatch(
    new RequestModelAction({
      // Java's URLEncoder.encode encodes spaces as plus sign but decodeURI expects spaces to be encoded as %20.
      // See also https://en.wikipedia.org/wiki/Query_string#URL_encoding for URL encoding in forms vs generic URL encoding.
      sourceUri: 'file://' + decodeURI(filePath.replace(/\+/g, '%20')),
      diagramType: diagramType
    })
  );
  actionDispatcher.dispatch(new RequestTypeHintsAction(diagramType));
  actionDispatcher.dispatch(new EnableToolPaletteAction());
}

function setWidgetId(mainWidgetId: string): void {
  const mainWidget = document.getElementById('sprotty');
  if (mainWidget) {
    mainWidget.id = mainWidgetId;
  }
}

const theme = urlParameters.theme || 'light';
document.documentElement.dataset.theme = theme;
