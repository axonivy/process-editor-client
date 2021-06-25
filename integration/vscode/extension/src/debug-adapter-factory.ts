import * as vscode from 'vscode';

export class IvyDebugAdapterServerDescriptorFactory implements vscode.DebugAdapterDescriptorFactory {

  createDebugAdapterDescriptor(session: vscode.DebugSession, executable: vscode.DebugAdapterExecutable | undefined): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
    const host: string = session.configuration.serverHost ?? 'localhost';
    const port: number = session.configuration.serverPort ?? 4711;
    return new vscode.DebugAdapterServer(port, host);
  }

  dispose(): void {
    // do nothing
  }
}
