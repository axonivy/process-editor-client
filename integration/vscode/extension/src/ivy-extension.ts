import {
  CenterAction,
  FitToScreenAction,
  GlspVscodeConnector,
  LayoutOperation,
  NavigateAction,
  RequestExportSvgAction
} from '@eclipse-glsp/vscode-integration';
import { SocketGlspVscodeServer } from '@eclipse-glsp/vscode-integration/lib/quickstart-components';
import * as process from 'process';
import * as vscode from 'vscode';

import IvyEditorProvider from './ivy-editor-provider';

const DEFAULT_SERVER_PORT = '5007';
export async function activate(context: vscode.ExtensionContext): Promise<void> {
  // Wrap server with quickstart component
  const workflowServer = new SocketGlspVscodeServer({
    clientId: 'ivy-glsp-process',
    clientName: 'ivy-glsp-process',
    serverPort: JSON.parse(process.env.GLSP_SERVER_PORT || DEFAULT_SERVER_PORT)
  });

  // Initialize GLSP-VSCode connector with server wrapper
  const glspVscodeConnector = new GlspVscodeConnector({
    server: workflowServer,
    logging: true
  });

  const customEditorProvider = vscode.window.registerCustomEditorProvider(
    'ivy.glspDiagram',
    new IvyEditorProvider(context, glspVscodeConnector),
    {
      webviewOptions: { retainContextWhenHidden: true },
      supportsMultipleEditorsPerDocument: false
    }
  );

  context.subscriptions.push(workflowServer, glspVscodeConnector, customEditorProvider);
  workflowServer.start();

  // Keep track of selected elements
  let selectedElements: string[] = [];
  context.subscriptions.push(
    glspVscodeConnector.onSelectionUpdate(n => {
      selectedElements = n;
      vscode.commands.executeCommand('setContext', 'workflow.editorSelectedElementsAmount', n.length);
    })
  );

  // Register various commands
  context.subscriptions.push(
    vscode.commands.registerCommand('workflow.fit', () => {
      glspVscodeConnector.sendActionToActiveClient(new FitToScreenAction(selectedElements));
    }),
    vscode.commands.registerCommand('workflow.center', () => {
      glspVscodeConnector.sendActionToActiveClient(new CenterAction(selectedElements));
    }),
    vscode.commands.registerCommand('workflow.layout', () => {
      glspVscodeConnector.sendActionToActiveClient(new LayoutOperation([]));
    }),
    vscode.commands.registerCommand('workflow.goToNextNode', () => {
      glspVscodeConnector.sendActionToActiveClient(new NavigateAction('next'));
    }),
    vscode.commands.registerCommand('workflow.goToPreviousNode', () => {
      glspVscodeConnector.sendActionToActiveClient(new NavigateAction('previous'));
    }),
    vscode.commands.registerCommand('workflow.showDocumentation', () => {
      glspVscodeConnector.sendActionToActiveClient(new NavigateAction('documentation'));
    }),
    vscode.commands.registerCommand('workflow.exportAsSVG', () => {
      glspVscodeConnector.sendActionToActiveClient(new RequestExportSvgAction());
    })
  );
}
