import {
  GlspDiagramEditorContext,
  GLSPEnvVariable,
  GLSPJavaServerArgs,
  GLSPWebView,
  JavaSocketServerConnectionProvider
} from '@eclipse-glsp/vscode-integration';
import { ServerConnectionProvider } from '@eclipse-glsp/vscode-integration/lib/server-connection-provider';
import { join } from 'path';
import { SprottyDiagramIdentifier } from 'sprotty-vscode-protocol';
import * as vscode from 'vscode';

import { BreakpointActionHandler } from './breakpoint/breakpoint-action-handler';
import { IvyWebView } from './ivy-webview';

export const DEFAULT_PORT = 5007;
export const PORT_ARG_KEY = 'WF_GLSP';
export const SERVER_DIR = join(__dirname, '..', 'server');

export class IvyGlspDiagramEditorContext extends GlspDiagramEditorContext {
  readonly id = 'ivy-glsp-process';
  readonly diagramType = 'ivy-glsp-process';

  get extensionPrefix(): string {
    return 'ivy';
  }

  protected getConnectionProvider(): ServerConnectionProvider {
    const launchOptions = {
      serverPort: GLSPEnvVariable.getServerPort() || DEFAULT_PORT,
      isRunning: GLSPEnvVariable.isServerDebug(),
      noConsoleLog: false,
      additionalArgs: GLSPJavaServerArgs.enableFileLogging(SERVER_DIR)
    };
    return new JavaSocketServerConnectionProvider(launchOptions);
  }

  createWebview(webviewPanel: vscode.WebviewPanel, identifier: SprottyDiagramIdentifier): GLSPWebView {
    return new IvyWebView({
      editorContext: this,
      identifier,
      localResourceRoots: [
        this.getExtensionFileUri('pack')
      ],
      scriptUri: this.getExtensionFileUri('pack', 'webview.js'),
      webviewPanel
    });
  }

  registerActionHandlers(webview: GLSPWebView): void {
    if (webview instanceof IvyWebView) {
      webview.addActionHandler(new BreakpointActionHandler(webview));
    }
  }
}
