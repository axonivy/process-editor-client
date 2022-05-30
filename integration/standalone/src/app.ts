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
  ToolBar,
  ivyToolBarModule,
  IVY_TYPES,
  ivyHoverModule
} from '@ivyteam/process-editor';
import { ApplicationIdProvider, BaseJsonrpcGLSPClient, GLSPClient, JsonrpcGLSPClient, NavigationTarget } from '@eclipse-glsp/protocol';
import { RequestModelAction, TYPES, SelectAction, Action, CenterAction } from 'sprotty';

import createContainer from './di.config';
import { getParameters, getServerDomain, isInViewerMode, isReadonly, isSecureConnection, isInPreviewMode } from './url-helper';

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

const actions: Action[] = [];

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
  if (isNumeric(zoom)) {
    addActions(new IvySetViewportZoomAction(+zoom / 100));
    if (highlight) {
      addActions(new CenterAction([highlight], false, true));
    } else if (selectElementIds) {
      addActions(...getSelectElementActions(new CenterAction(getElementIds(), false, true)));
    }
  } else if (selectElementIds) {
    addActions(...getSelectElementActions(new MoveIntoViewportAction(getElementIds())));
  } else if (highlight) {
    addActions(new MoveIntoViewportAction([highlight]));
  }
  dispatcher.onceModelInitialized().finally(() => dispatcher.dispatchAll(actions));
}

function isNumeric(num: any): boolean {
  return !isNaN(parseFloat(num)) && isFinite(num);
}

function addActions(...newActions: Action[]): void {
  actions.push(...newActions);
}

function getSelectElementActions(action: Action): Action[] {
  return [new SelectAction(getElementIds()), action];
}

function getElementIds(): string[] {
  return selectElementIds.split(NavigationTarget.ELEMENT_IDS_SEPARATOR);
}

function setViewerMode(): void {
  container.get<ToolBar>(IVY_TYPES.ToolBar).disable();
  container.unload(ivyToolBarModule);
  container.unload(ivyHoverModule);
}

websocket.onerror = ev => alert('Connection to server errored. Please make sure that the server is running');
