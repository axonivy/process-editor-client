import { Message } from 'vscode-jsonrpc';
import { BaseJsonrpcGLSPClient, ClientState } from '@eclipse-glsp/client';
import * as Toastify from 'toastify-js';

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
}
