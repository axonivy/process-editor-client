import '../css/colors.css';
import '@eclipse-glsp/vscode-integration-webview/css/glsp-vscode.css';

import { GLSPStarter } from '@eclipse-glsp/vscode-integration-webview';
import { ivyBreakpointModule, createIvyDiagramContainer } from '@ivyteam/process-editor';
import { Container } from 'inversify';
import { SprottyDiagramIdentifier } from 'sprotty-vscode-webview';

class IvyGLSPStarter extends GLSPStarter {
  createContainer(diagramIdentifier: SprottyDiagramIdentifier): Container {
    const container = createIvyDiagramContainer(diagramIdentifier.clientId);
    container.load(ivyBreakpointModule);
    return container;
  }
}

export function launch(): void {
  new IvyGLSPStarter();
}
