import 'reflect-metadata';

import {
  EnableToolPaletteAction,
  GLSPDiagramServer,
  InitializeClientSessionAction,
  RequestTypeHintsAction
} from '@eclipse-glsp/client';
import { ApplicationIdProvider, BaseJsonrpcGLSPClient, JsonrpcGLSPClient } from '@eclipse-glsp/protocol';
import { join, resolve } from 'path';
import { IActionDispatcher, RequestModelAction, TYPES } from 'sprotty';

import createContainer from './di.config';
import { getParameters } from './url-parameters';

const port = 5008;
const id = 'ivy-glsp-process';
const name = 'Ivy Process';
const websocket = new WebSocket(`ws://localhost:${port}/${id}`);
const container = createContainer();

let givenFile = getParameters()['file'];
if (givenFile === undefined) {
  const loc = window.location.pathname;
  const currentDir = loc.substring(0, loc.lastIndexOf('/'));
  givenFile = resolve(join(currentDir, '..', 'app', 'demo-project', 'processes', 'test.mod'));
}

const diagramServer = container.get<GLSPDiagramServer>(TYPES.ModelSource);
diagramServer.clientId = ApplicationIdProvider.get() + '_' + givenFile;

const actionDispatcher = container.get<IActionDispatcher>(TYPES.IActionDispatcher);

websocket.onopen = () => {
  const connectionProvider = JsonrpcGLSPClient.createWebsocketConnectionProvider(websocket);
  const glspClient = new BaseJsonrpcGLSPClient({ id, name, connectionProvider });
  diagramServer.connect(glspClient).then(client => {
    client.initializeServer({ applicationId: ApplicationIdProvider.get() });
    actionDispatcher.dispatch(new InitializeClientSessionAction(diagramServer.clientId));
    actionDispatcher.dispatch(new RequestModelAction({
      sourceUri: `file://${givenFile}`,
      diagramType: 'ivy-glsp-process'
    }));
    actionDispatcher.dispatch(new RequestTypeHintsAction('ivy-glsp-process'));
    actionDispatcher.dispatch(new EnableToolPaletteAction());
  });
};

websocket.onerror = ev => alert('Connection to server errored. Please make sure that the server is running');

