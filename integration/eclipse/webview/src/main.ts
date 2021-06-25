import 'reflect-metadata';

import {
  EnableToolPaletteAction,
  GLSPActionDispatcher,
  GLSPDiagramServer,
  InitializeClientSessionAction,
  RequestTypeHintsAction
} from '@eclipse-glsp/client';
import { getParameters } from '@eclipse-glsp/ide';
import { ApplicationIdProvider, BaseJsonrpcGLSPClient, JsonrpcGLSPClient } from '@eclipse-glsp/protocol';
import { CenterAction, RequestModelAction, TYPES } from 'sprotty';

import createContainer from './di.config';

const urlParameters = getParameters();
const filePath = urlParameters.path;

// In the Eclipse Integration, port is dynamic, as multiple editors
// and/or Eclipse Servers may be running in parallel (e.g. 1/Eclipse IDE)
const port = parseInt(urlParameters.port, 10);
const id = 'ivy-glsp-process';
const name = 'Ivy Process';
const websocket = new WebSocket(`ws://localhost:${port}/${id}`);

const clientId = urlParameters.client || ApplicationIdProvider.get();
const widgetId = urlParameters.widget || clientId;
setWidgetId(widgetId);
const container = createContainer(widgetId);

const diagramServer = container.get<GLSPDiagramServer>(TYPES.ModelSource);
diagramServer.clientId = clientId;

const actionDispatcher = container.get<GLSPActionDispatcher>(TYPES.IActionDispatcher);

websocket.onopen = () => {
  const connectionProvider = JsonrpcGLSPClient.createWebsocketConnectionProvider(websocket);
  const glspClient = new BaseJsonrpcGLSPClient({ id, name, connectionProvider });
  diagramServer.connect(glspClient).then(client => {
    client.initializeServer({ applicationId: ApplicationIdProvider.get() });
    actionDispatcher.dispatch(new InitializeClientSessionAction(diagramServer.clientId));
    actionDispatcher.dispatch(new RequestModelAction({
      // Java's URLEncoder.encode encodes spaces as plus sign but decodeURI expects spaces to be encoded as %20.
      // See also https://en.wikipedia.org/wiki/Query_string#URL_encoding for URL encoding in forms vs generic URL encoding.
      sourceUri: 'file://' + decodeURI(filePath.replace(/\+/g, '%20')),
      diagramType: 'ivy-glsp-process'
    }));
    actionDispatcher.dispatch(new RequestTypeHintsAction('ivy-glsp-process'));
    actionDispatcher.dispatch(new EnableToolPaletteAction());
    actionDispatcher.onceModelInitialized().then(() => actionDispatcher.dispatch(new CenterAction([])));
  });
};

function setWidgetId(mainWidgetId: string): void {
  const mainWidget = document.getElementById('sprotty');
  if (mainWidget) {
    mainWidget.id = mainWidgetId;
  }
}

const theme = urlParameters.theme || 'light';
document.documentElement.dataset.theme = theme;
