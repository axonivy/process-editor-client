import * as vscode from 'vscode';

export class IvyDebugAdapterServerDescriptorFactory implements vscode.DebugAdapterDescriptorFactory {

    createDebugAdapterDescriptor(session: vscode.DebugSession, executable: vscode.DebugAdapterExecutable | undefined): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {

        return new vscode.DebugAdapterServer(4711, 'localhost');
    }

    dispose(): void {
        // do nothing
    }
}
