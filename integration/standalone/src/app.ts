import {
  configureServerActions,
  EnableToolPaletteAction,
  GLSPDiagramServer,
  RequestTypeHintsAction,
  GLSPActionDispatcher,
  RankingMouseTool,
  GLSP_TYPES
} from '@eclipse-glsp/client';
import {
  appendIconFontToDom,
  MoveIntoViewportAction,
  IvySetViewportZoomAction,
  EnableViewportAction,
  ToolBar,
  ivyToolBarModule,
  IVY_TYPES,
  ivyHoverModule,
  IvyHoverMouseListener
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
    actions.push(...showElement((ids: string[]) => new CenterAction(ids, false, true)));
  } else {
    actions.push(...showElement((ids: string[]) => new MoveIntoViewportAction(ids, false, true)));
  }
  dispatcher.onceModelInitialized().finally(() => dispatcher.dispatchAll(actions));
}

function showElement(action: (elementIds: string[]) => Action): Action[] {
  if (highlight) {
    return [action([highlight])];
  }
  if (selectElementIds) {
    const elementIds = selectElementIds.split(NavigationTarget.ELEMENT_IDS_SEPARATOR);
    return [new SelectAction(elementIds), action(elementIds)];
  }
  return [];
}

function isNumeric(num: any): boolean {
  return !isNaN(parseFloat(num)) && isFinite(num);
}

function setViewerMode(): void {
  container.get<ToolBar>(IVY_TYPES.ToolBar).disable();
  container.unload(ivyToolBarModule);
  const mouseListener = container.get<IvyHoverMouseListener>(IVY_TYPES.IvyHoverMouseListener);
  container.get<RankingMouseTool>(GLSP_TYPES.MouseTool).deregister(mouseListener);
  container.unload(ivyHoverModule);
}

websocket.onerror = ev => alert('Connection to server errored. Please make sure that the server is running');
