import {
  configureServerActions,
  EnableToolPaletteAction,
  GLSPActionDispatcher,
  GLSPDiagramServer,
  listen,
  RequestModelAction,
  RequestTypeHintsAction,
  TYPES
} from '@eclipse-glsp/client';

import { getParameters } from '@eclipse-glsp/ide';
import { ApplicationIdProvider, GLSPClient } from '@eclipse-glsp/protocol';
import { IvyBaseJsonrpcGLSPClient } from '@axonivy/process-editor';
import { MessageConnection } from 'vscode-jsonrpc';

import createContainer from './di.config';
import {
  EnableInscriptionAction,
  EnableViewportAction,
  ShowGridAction,
  SwitchThemeAction,
  ThemeMode
} from '@axonivy/process-editor-protocol';
import { MonacoUtil } from '@axonivy/inscription-core';
import { MonacoEditorUtil } from '@axonivy/inscription-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import * as reactMonaco from 'monaco-editor/esm/vs/editor/editor.api';
import './index.css';

const urlParameters = getParameters();
const filePath = urlParameters.path;

// In the Eclipse Integration, port is dynamic, as multiple editors
// and/or Eclipse Servers may be running in parallel (e.g. 1/Eclipse IDE)
const port = parseInt(urlParameters.port, 10);
const applicationId = urlParameters.application;
const id = 'ivy-glsp-process';
const diagramType = 'ivy-glsp-process';
const websocket = new WebSocket(`ws://localhost:${port}/${id}`);

const theme = (urlParameters.theme as ThemeMode) ?? 'light';

const clientId = urlParameters.client || ApplicationIdProvider.get();
const widgetId = urlParameters.widget || clientId;
setWidgetId(widgetId);
const container = createContainer(widgetId);

const diagramServer = container.get<GLSPDiagramServer>(TYPES.ModelSource);
diagramServer.clientId = clientId;
listen(websocket, connection => initialize(connection));

async function initialize(connectionProvider: MessageConnection): Promise<void> {
  const client = new IvyBaseJsonrpcGLSPClient({ id, connectionProvider });
  await diagramServer.connect(client);
  const result = await client.initializeServer({
    applicationId,
    protocolVersion: GLSPClient.protocolVersion
  });
  await configureServerActions(result, diagramType, container);

  await client.initializeClientSession({ clientSessionId: diagramServer.clientId, diagramType });
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
        MonacoUtil.initStandalone(editorWorker).then(() => MonacoEditorUtil.initMonaco(reactMonaco, theme));
        actionDispatcher.dispatch(EnableInscriptionAction.create({}));
      })
    );
  actionDispatcher.dispatch(RequestTypeHintsAction.create({ requestId: diagramType }));
  actionDispatcher.dispatch(EnableToolPaletteAction.create());
  actionDispatcher.dispatch(EnableViewportAction.create());
  actionDispatcher.dispatch(SwitchThemeAction.create({ theme }));
  actionDispatcher.dispatch(ShowGridAction.create({ show: urlParameters.grid === 'true' ?? true }));
}

function setWidgetId(mainWidgetId: string): void {
  const mainWidget = document.getElementById('sprotty');
  if (mainWidget) {
    mainWidget.id = mainWidgetId;
  }
}
