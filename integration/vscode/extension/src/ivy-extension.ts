import { GlspVscodeConnector, NavigateAction } from '@eclipse-glsp/vscode-integration';
import { configureDefaultCommands, SocketGlspVscodeServer } from '@eclipse-glsp/vscode-integration/lib/quickstart-components';
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

  configureDefaultCommands({ extensionContext: context, connector: glspVscodeConnector, diagramPrefix: 'workflow' });

  // Register various commands
  context.subscriptions.push(
    vscode.commands.registerCommand('workflow.goToNextNode', () => {
      glspVscodeConnector.sendActionToActiveClient(NavigateAction.create('next'));
    }),
    vscode.commands.registerCommand('workflow.goToPreviousNode', () => {
      glspVscodeConnector.sendActionToActiveClient(NavigateAction.create('previous'));
    }),
    vscode.commands.registerCommand('workflow.showDocumentation', () => {
      glspVscodeConnector.sendActionToActiveClient(NavigateAction.create('documentation'));
    })
  );
}
