/********************************************************************************
 * Copyright (c) 2023 STMicroelectronics and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

// based on https://github.com/TypeFox/monaco-languageclient/blob/vwj-2.0.1/packages/vscode-ws-jsonrpc/src/socket/reader.ts
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2022 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { createMessageConnection, Disposable, type Logger, type MessageConnection } from 'vscode-jsonrpc';
import { WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc';

/**
 * A wrapper interface that enables the reuse of the {@link WebSocketMessageReader} and {@link WebSocketMessageWriter}
 * independent of the underlying WebSocket implementation/library. e.g. one could use Socket.io instead of plain WebSockets
 */
export interface WebSocketWrapper extends Disposable {
  send(content: string | ArrayBufferLike | ArrayBufferView): void;
  onMessage(cb: (data: unknown) => void): void;
  onError(cb: (reason: unknown) => void): void;
  onClose(cb: (code: number, reason: string) => void): void;
}

/**
 * Creates a {@link WebSocketWrapper} for the given plain WebSocket
 * @param socket The socket to wrap
 */
export function wrap(socket: WebSocket): WebSocketWrapper {
  return {
    send: content => socket.send(content),
    onMessage: cb => (socket.onmessage = event => cb(event.data)),
    onClose: cb => (socket.onclose = event => cb(event.code, event.reason)),
    onError: cb =>
      (socket.onerror = event => {
        if ('error' in event) {
          // @ts-ignore
          cb(event.error);
        }
      }),
    dispose: () => socket.close()
  };
}

/**
 * Create a `vscode-jsonrpc` {@link MessageConnection} on top of a given {@link WebSocketWrapper}.
 */
export function createWebSocketConnection(socket: WebSocketWrapper, logger?: Logger): MessageConnection {
  const reader = new WebSocketMessageReader(socket);
  const writer = new WebSocketMessageWriter(socket);
  return createMessageConnection(reader, writer, logger);
}

/**
 * Creates a new {@link MessageConnection} on top of the given websocket on open.
 * @param webSocket The target webSocket
 * @param onConnection Optional callback that is invoked after the connection has been created
 * @param logger Optional connection logger
 * @returns A promise of the created connection
 */
export function listen(
  webSocket: WebSocket,
  onConnection?: (connection: MessageConnection) => void,
  logger?: Logger
): Promise<MessageConnection> {
  return new Promise(resolve => {
    webSocket.onopen = () => {
      const socket = wrap(webSocket);
      const connection = createWebSocketConnection(socket, logger);
      onConnection?.(connection);
      resolve(connection);
    };
  });
}
