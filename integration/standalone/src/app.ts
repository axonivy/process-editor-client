import {
  configureServerActions,
  EnableToolPaletteAction,
  GLSPDiagramServer,
  RequestTypeHintsAction,
  GLSPActionDispatcher
} from '@eclipse-glsp/client';
import { appendIconFontToDom, MoveIntoViewportAction } from '@ivyteam/process-editor';
import { ApplicationIdProvider, BaseJsonrpcGLSPClient, GLSPClient, JsonrpcGLSPClient, NavigationTarget } from '@eclipse-glsp/protocol';
import { RequestModelAction, TYPES, SelectAction, Action } from 'sprotty';

import createContainer from './di.config';
import { getParameters, getServerDomain, isReadonly, isSecureConnection } from './url-helper';

const parameters = getParameters();
let server = parameters['server'];
if (server === undefined) {
  server = getServerDomain();
}
const id = 'ivy-glsp-process';
const diagramType = 'ivy-glsp-process';
const websocket = new WebSocket(`${isSecureConnection() ? 'wss' : 'ws'}://${server}/${id}`);
const container = createContainer();

const app = server.slice(server.lastIndexOf('/') + 1);
const pmv = parameters['pmv'];
const pid = parameters['pid'] ?? '';
const givenFile = parameters['file'] ?? '';
const highlight = parameters['highlight'];
const selectElementIds = parameters['selectElementIds'];

appendIconFontToDom(`${isSecureConnection() ? 'https' : 'http'}://${server}`);

const diagramServer = container.get<GLSPDiagramServer>(TYPES.ModelSource);
diagramServer.clientId = ApplicationIdProvider.get() + '_' + givenFile + pid;

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

  const actionDispatcher = container.get<GLSPActionDispatcher>(TYPES.IActionDispatcher);

  await client.initializeClientSession({ clientSessionId: diagramServer.clientId, diagramType });
  actionDispatcher
    .dispatch(
      new RequestModelAction({
        sourceUri: givenFile,
        app: app,
        pmv: pmv,
        pid: pid,
        highlight: highlight,
        readonly: isReadonly(),
        diagramType
      })
    )
    .then(() => dispatchAfterModelInitialized(actionDispatcher));
  actionDispatcher.dispatch(new RequestTypeHintsAction(diagramType));
  actionDispatcher.dispatch(new EnableToolPaletteAction());
}

function dispatchAfterModelInitialized(dispatcher: GLSPActionDispatcher): void {
  const actions: Action[] = [];
  if (selectElementIds) {
    const elementIds = selectElementIds.split(NavigationTarget.ELEMENT_IDS_SEPARATOR);
    actions.push(new SelectAction(elementIds));
    actions.push(new MoveIntoViewportAction(elementIds));
  }
  if (highlight) {
    actions.push(new MoveIntoViewportAction([highlight]));
  }
  if (actions.length > 0) {
    dispatcher.onceModelInitialized().finally(() => dispatcher.dispatchAll(actions));
  }
}

websocket.onerror = ev => alert('Connection to server errored. Please make sure that the server is running');
