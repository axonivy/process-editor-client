import { configureServerActions, EnableToolPaletteAction, GLSPDiagramServer, RequestTypeHintsAction } from '@eclipse-glsp/client';
import { ApplicationIdProvider, BaseJsonrpcGLSPClient, GLSPClient, JsonrpcGLSPClient } from '@eclipse-glsp/protocol';
import { join, resolve } from 'path';
import { IActionDispatcher, RequestModelAction, TYPES } from 'sprotty';

import createContainer from './di.config';
import { getParameters } from './url-parameters';

let severAndPort = getParameters()['server'];
if (severAndPort === undefined) {
  severAndPort = 'localhost:5008';
}
const id = 'ivy-glsp-process';
const diagramType = 'ivy-glsp-process';
const websocket = new WebSocket(`ws://${severAndPort}/${id}`);
const container = createContainer();

let givenFile = getParameters()['file'];
if (givenFile === undefined) {
  const loc = window.location.pathname;
  const currentDir = loc.substring(0, loc.lastIndexOf('/'));
  givenFile = resolve(join(currentDir, '..', 'app', 'demo-project', 'processes', 'test.mod'));
}

const diagramServer = container.get<GLSPDiagramServer>(TYPES.ModelSource);
diagramServer.clientId = ApplicationIdProvider.get() + '_' + givenFile;

websocket.onopen = () => {
  const connectionProvider = JsonrpcGLSPClient.createWebsocketConnectionProvider(websocket);
  const glspClient = new BaseJsonrpcGLSPClient({ id, connectionProvider });
  initialize(glspClient);
};

async function initialize(client: GLSPClient): Promise<void> {
  await diagramServer.connect(client);
  const result = await client.initializeServer({
    applicationId: ApplicationIdProvider.get(),
    protocolVersion: GLSPClient.protocolVersion
  });
  await configureServerActions(result, diagramType, container);

  const actionDispatcher = container.get<IActionDispatcher>(TYPES.IActionDispatcher);

  await client.initializeClientSession({ clientSessionId: diagramServer.clientId, diagramType });
  actionDispatcher.dispatch(
    new RequestModelAction({
      sourceUri: `file://${givenFile}`,
      diagramType
    })
  );
  actionDispatcher.dispatch(new RequestTypeHintsAction(diagramType));
  actionDispatcher.dispatch(new EnableToolPaletteAction());
}

websocket.onerror = ev => alert('Connection to server errored. Please make sure that the server is running');
