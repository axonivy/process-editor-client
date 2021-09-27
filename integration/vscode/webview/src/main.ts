import '../css/colors.css';
import '@eclipse-glsp/vscode-integration-webview/css/glsp-vscode.css';
import 'reflect-metadata';

import { NavigateToExternalTargetAction } from '@eclipse-glsp/client';
import { GLSPStarter } from '@eclipse-glsp/vscode-integration-webview';
import { breakpointModule, createIvyDiagramContainer } from '@ivyteam/process-editor';
import { BreakpointAction } from '@ivyteam/process-editor/lib/breakpoint/breakpoint';
import { Container } from 'inversify';
import { SprottyDiagramIdentifier } from 'sprotty-vscode-webview';

export class IvyGLSPStarter extends GLSPStarter {
  createContainer(diagramIdentifier: SprottyDiagramIdentifier): Container {
    const container = createIvyDiagramContainer(diagramIdentifier.clientId);
    container.load(breakpointModule);
    return container;
  }

  protected get extensionActionKinds(): string[] {
    return [NavigateToExternalTargetAction.KIND, BreakpointAction.KIND];
  }
}

new IvyGLSPStarter();
