import {
  Action,
  CenterAction,
  configureServerActions,
  EnableToolPaletteAction,
  GLSPActionDispatcher,
  GLSPDiagramServer,
  listen,
  RequestModelAction,
  RequestTypeHintsAction,
  SelectAction,
  TYPES
} from '@eclipse-glsp/client';
import { ApplicationIdProvider, GLSPClient, NavigationTarget } from '@eclipse-glsp/protocol';
import {
  EnableViewportAction,
  IvyBaseJsonrpcGLSPClient,
  IvySetViewportZoomAction,
  ivyToolBarModule,
  IVY_TYPES,
  MoveIntoViewportAction,
  overrideIvyViewerOptions,
  SwitchThemeAction,
  SwitchThemeActionHandler,
  ToolBar
} from '@ivyteam/process-editor';
import { MessageConnection } from 'vscode-jsonrpc';
import createContainer from './di.config';
import { getParameters, getServerDomain, isInPreviewMode, isInViewerMode, isReadonly, isSecureConnection } from './url-helper';

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

const diagramServer = container.get<GLSPDiagramServer>(TYPES.ModelSource);
diagramServer.clientId = ApplicationIdProvider.get() + '_' + givenFile + pid;
listen(websocket, connection => initialize(connection));

async function initialize(connectionProvider: MessageConnection): Promise<void> {
  const client = new IvyBaseJsonrpcGLSPClient({ id, connectionProvider });
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
      RequestModelAction.create({
        options: { sourceUri: givenFile, app: app, pmv: pmv, pid: pid, highlight: highlight, readonly: isReadonly(), diagramType }
      })
    )
    .then(() => dispatchAfterModelInitialized(actionDispatcher))
    .then(() => actionDispatcher.dispatch(RequestTypeHintsAction.create({ requestId: diagramType })))
    .then(() => {
      if (isInViewerMode() || isInPreviewMode()) {
        setViewerMode();
      } else {
        actionDispatcher.dispatch(EnableToolPaletteAction.create());
      }
      if (!isInPreviewMode()) {
        actionDispatcher.dispatch(EnableViewportAction.create());
      }
    });
}

async function dispatchAfterModelInitialized(dispatcher: GLSPActionDispatcher): Promise<void> {
  const actions: Action[] = [];
  if (isNumeric(zoom)) {
    actions.push(IvySetViewportZoomAction.create({ zoom: +zoom / 100 }));
    actions.push(...showElement((ids: string[]) => CenterAction.create(ids, { animate: false, retainZoom: true })));
  } else {
    actions.push(...showElement((ids: string[]) => MoveIntoViewportAction.create({ elementIds: ids, animate: false, retainZoom: true })));
  }
  actions.push(SwitchThemeAction.create({ theme: parameters.theme ?? SwitchThemeActionHandler.prefsColorScheme() }));
  return dispatcher.onceModelInitialized().finally(() => dispatcher.dispatchAll(actions));
}

function showElement(action: (elementIds: string[]) => Action): Action[] {
  if (highlight) {
    return [action([highlight])];
  }
  if (selectElementIds) {
    const elementIds = selectElementIds.split(NavigationTarget.ELEMENT_IDS_SEPARATOR);
    return [SelectAction.create({ selectedElementsIDs: elementIds }), action(elementIds)];
  }
  return [];
}

function isNumeric(num: any): boolean {
  return !isNaN(parseFloat(num)) && isFinite(num);
}

function setViewerMode(): void {
  container.get<ToolBar>(IVY_TYPES.ToolBar).disable();
  container.unload(ivyToolBarModule);
  overrideIvyViewerOptions(container, { hideSensitiveInfo: true });
}

websocket.onerror = ev => alert('Connection to server errored. Please make sure that the server is running');
