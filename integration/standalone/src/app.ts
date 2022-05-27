import {
  configureServerActions,
  EnableToolPaletteAction,
  GLSPDiagramServer,
  RequestTypeHintsAction,
  GLSPActionDispatcher
} from '@eclipse-glsp/client';
import {
  appendIconFontToDom,
  MoveIntoViewportAction,
  IvySetViewportZoomAction,
  EnableViewportAction,
  ivyToolBarModule,
  ivyHoverModule
} from '@ivyteam/process-editor';
import { ApplicationIdProvider, BaseJsonrpcGLSPClient, GLSPClient, JsonrpcGLSPClient, NavigationTarget } from '@eclipse-glsp/protocol';
import { RequestModelAction, TYPES, SelectAction, Action, CenterAction } from 'sprotty';

import createContainer from './di.config';
import { getParameters, getServerDomain, isInViewerMode, isReadonly, isSecureConnection, isInPreviewMode } from './url-helper';
import ivyStandaloneToolBarModule from './tool-bar/di.config';

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
const zoom = parameters['zoom'];

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
  if (isInViewerMode() || isInPreviewMode()) {
    setViewerMode();
  } else {
    actionDispatcher.dispatch(new EnableToolPaletteAction());
  }
  if (!isInPreviewMode()) {
    actionDispatcher.dispatch(new EnableViewportAction());
  }
}

function dispatchAfterModelInitialized(dispatcher: GLSPActionDispatcher): void {
  const actions: Action[] = [];
  if (isNumeric(zoom)) {
    actions.push(new IvySetViewportZoomAction(+zoom / 100));
    if (highlight) {
      actions.push(new CenterAction([highlight], false, true));
    } else if (selectElementIds) {
      const elementIds = selectElementIds.split(NavigationTarget.ELEMENT_IDS_SEPARATOR);
      actions.push(new SelectAction(elementIds));
      actions.push(new CenterAction(elementIds, false, true));
    }
  } else if (selectElementIds) {
    const elementIds = selectElementIds.split(NavigationTarget.ELEMENT_IDS_SEPARATOR);
    actions.push(new SelectAction(elementIds));
    actions.push(new MoveIntoViewportAction(elementIds));
  } else if (highlight) {
    actions.push(new MoveIntoViewportAction([highlight]));
  }
  dispatcher.onceModelInitialized().finally(() => dispatcher.dispatchAll(actions));
}

function setViewerMode(): void {
  container.unload(ivyToolBarModule);
  container.load(ivyStandaloneToolBarModule);
  container.unload(ivyHoverModule);
}

function isNumeric(num: any): boolean {
  return !isNaN(parseFloat(num)) && isFinite(num);
}

websocket.onerror = ev => alert('Connection to server errored. Please make sure that the server is running');
