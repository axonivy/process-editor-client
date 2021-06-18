import '@eclipse-glsp/vscode-integration-webview/css/glsp-vscode.css';
import 'reflect-metadata';

import { GLSPStarter } from '@eclipse-glsp/vscode-integration-webview';
import { createIvyDiagramContainer } from '@ivyteam/process-editor';
import { Container } from 'inversify';
import { SprottyDiagramIdentifier } from 'sprotty-vscode-webview';

export class WorkflowGLSPStarter extends GLSPStarter {
    createContainer(diagramIdentifier: SprottyDiagramIdentifier): Container {
        return createIvyDiagramContainer(diagramIdentifier.clientId);
    }
}

new WorkflowGLSPStarter();
