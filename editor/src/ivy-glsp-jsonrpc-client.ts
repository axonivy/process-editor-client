import type { Message } from 'vscode-ws-jsonrpc';
import { BaseJsonrpcGLSPClient, ClientState } from '@eclipse-glsp/client';

export class IvyBaseJsonrpcGLSPClient extends BaseJsonrpcGLSPClient {
  error(message: string, ...optionalParams: any[]): void {
    console.error(`[IvyJsonrpcGLSPClient] ${message}`, optionalParams);
  }

  protected handleConnectionError(error: Error, message: Message | undefined, count: number | undefined): void {
    this.error('Connection to server is erroring. Shutting down server.', error);
    this.stop();
    this.state = ClientState.ServerError;
  }
}
