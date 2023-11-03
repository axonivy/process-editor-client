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
  IvyBaseJsonrpcGLSPClient,
  ivyToolBarModule,
  IVY_TYPES,
  overrideIvyViewerOptions,
  SwitchThemeActionHandler,
  ToolBar
} from '@axonivy/process-editor';
import { MessageConnection } from 'vscode-jsonrpc';
import createContainer from './di.config';
import { getParameters, getServerDomain, isInPreviewMode, isInViewerMode, isReadonly, isSecureConnection } from './url-helper';
import {
  EnableInscriptionAction,
  EnableViewportAction,
  MoveIntoViewportAction,
  SetViewportZoomAction,
  SwitchThemeAction,
  ThemeMode
} from '@axonivy/process-editor-protocol';
import { MonacoUtil } from '@axonivy/inscription-core';
import { MonacoEditorUtil } from '@axonivy/inscription-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import * as reactMonaco from 'monaco-editor/esm/vs/editor/editor.api';
import './index.css';

const parameters = getParameters();
let server = parameters.get('server');
if (server === undefined) {
  server = getServerDomain();
}
const app = parameters.get('app') ?? 'designer';
const id = 'ivy-glsp-process';
const diagramType = 'ivy-glsp-process';
const webSocketBase = `${isSecureConnection() ? 'wss' : 'ws'}://${server}/`;
const websocket = new WebSocket(`${webSocketBase}${app}/${id}`);
const container = createContainer();

const pmv = parameters.get('pmv') ?? '';
const pid = parameters.get('pid') ?? '';
const givenFile = parameters.get('file') ?? '';
const highlight = parameters.get('highlight') ?? '';
const selectElementIds = parameters.get('selectElementIds');
const zoom = parameters.get('zoom') ?? '';
const theme = (parameters.get('theme') as ThemeMode) ?? SwitchThemeActionHandler.prefsColorScheme();

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
        MonacoUtil.initStandalone(editorWorker);
        MonacoEditorUtil.initMonaco(reactMonaco, theme);
        actionDispatcher.dispatch(EnableInscriptionAction.create({ server: webSocketBase, app, pmv }));
      }
      if (!isInPreviewMode()) {
        actionDispatcher.dispatch(EnableViewportAction.create());
      }
    });
}

async function dispatchAfterModelInitialized(dispatcher: GLSPActionDispatcher): Promise<void> {
  const actions: Action[] = [];
  if (isNumeric(zoom)) {
    actions.push(SetViewportZoomAction.create({ zoom: +zoom / 100 }));
    actions.push(...showElement((ids: string[]) => CenterAction.create(ids, { animate: false, retainZoom: true })));
  } else {
    actions.push(...showElement((ids: string[]) => MoveIntoViewportAction.create({ elementIds: ids, animate: false, retainZoom: true })));
  }
  actions.push(SwitchThemeAction.create({ theme }));
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
