import {
  configureServerActions,
  EnableToolPaletteAction,
  GLSPActionDispatcher,
  GLSPDiagramServer,
  listen,
  NavigationTarget,
  RequestModelAction,
  RequestTypeHintsAction,
  SelectAction,
  TYPES
} from '@eclipse-glsp/client';
import { ApplicationIdProvider, GLSPClient } from '@eclipse-glsp/protocol';
import { IvyBaseJsonrpcGLSPClient, SwitchThemeActionHandler } from '@axonivy/process-editor';
import { MessageConnection } from 'vscode-jsonrpc';
import createContainer from './di.config';
import { getParameters, getServerDomain, isReadonly, isSecureConnection } from './url-helper';
import { EnableViewportAction, SwitchThemeAction, ThemeMode } from '@axonivy/process-editor-protocol';
import { MonacoUtil } from '@axonivy/inscription-core';
import { MonacoEditorUtil } from '@axonivy/inscription-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import * as reactMonaco from 'monaco-editor/esm/vs/editor/editor.api';
import './index.css';
import { EnableInscriptionAction } from '@axonivy/process-editor-inscription';

const parameters = getParameters();
const app = parameters.get('app') ?? 'designer';
let server = parameters.get('server');
if (!server) {
  server = getServerDomain().replace(app, '');
}
const id = 'ivy-glsp-process';
const diagramType = 'ivy-glsp-process';
const webSocketBase = `${isSecureConnection() ? 'wss' : 'ws'}://${server}/`;
const websocket = new WebSocket(`${webSocketBase}${app}/${id}`);
const container = createContainer();

const pmv = parameters.get('pmv') ?? '';
const pid = parameters.get('pid') ?? '';
const givenFile = parameters.get('file') ?? '';
const selectElementIds = parameters.get('selectElementIds');
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
        options: { sourceUri: givenFile, app: app, pmv: pmv, pid: pid, readonly: isReadonly(), diagramType }
      })
    )
    .then(() => {
      actionDispatcher.onceModelInitialized().finally(() => {
        MonacoUtil.initStandalone(editorWorker).then(() => MonacoEditorUtil.initMonaco(reactMonaco, theme));
        actionDispatcher.dispatch(EnableInscriptionAction.create({ server: webSocketBase, inscriptionContext: { app, pmv } }));
        if (selectElementIds) {
          const elementIds = selectElementIds.split(NavigationTarget.ELEMENT_IDS_SEPARATOR);
          actionDispatcher.dispatch(SelectAction.create({ selectedElementsIDs: elementIds }));
        }
      });
    });
  actionDispatcher.dispatch(RequestTypeHintsAction.create({ requestId: diagramType }));
  actionDispatcher.dispatch(EnableToolPaletteAction.create());
  actionDispatcher.dispatch(EnableViewportAction.create());
  actionDispatcher.dispatch(SwitchThemeAction.create({ theme }));
}

websocket.onerror = ev => alert('Connection to server errored. Please make sure that the server is running');
