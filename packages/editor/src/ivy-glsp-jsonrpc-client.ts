import { Message } from 'vscode-jsonrpc';
import { BaseJsonrpcGLSPClient, ClientState } from '@eclipse-glsp/client';
import Toastify from 'toastify-js';

export class IvyBaseJsonrpcGLSPClient extends BaseJsonrpcGLSPClient {
  error(message: string, ...optionalParams: any[]): void {
    console.error(`[IvyJsonrpcGLSPClient] ${message}`, optionalParams);
    Toastify({
      text: `${message}  (Click to reload)`,
      className: 'severity-ERROR',
      duration: -1,
      close: true,
      gravity: 'bottom',
      position: 'left',
      onClick: () => window.location.reload()
    }).showToast();
  }

  protected handleConnectionError(error: Error, message: Message | undefined, count: number | undefined): void {
    this.error('Connection to server is erroring. Shutting down server.', error);
    this.stop();
    this.state = ClientState.ServerError;
  }

  protected handleConnectionClosed(): void {
    if (this.state === ClientState.Stopping || this.state === ClientState.Stopped) {
      return;
    }
    try {
      if (this.resolvedConnection) {
        this.resolvedConnection.dispose();
        this.connectionPromise = undefined;
        this.resolvedConnection = undefined;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Disposing a connection could fail if error cases.
    }

    this.error('Connection to server got closed.');
    this.state = ClientState.ServerError;
  }
}
