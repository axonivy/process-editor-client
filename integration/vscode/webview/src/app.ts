import '@eclipse-glsp/vscode-integration-webview/css/glsp-vscode.css';

import { GLSPStarter } from '@eclipse-glsp/vscode-integration-webview';
import { breakpointModule, createIvyDiagramContainer } from '@ivyteam/process-editor';
import { Container } from 'inversify';
import { SprottyDiagramIdentifier } from 'sprotty-vscode-webview';

class IvyGLSPStarter extends GLSPStarter {
  createContainer(diagramIdentifier: SprottyDiagramIdentifier): Container {
    const container = createIvyDiagramContainer(diagramIdentifier.clientId);
    container.load(breakpointModule);
    return container;
  }
}

export function launch(): void {
  new IvyGLSPStarter();
}
