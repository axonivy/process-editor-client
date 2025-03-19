import { InscriptionClientJsonRpc, IvyScriptLanguage } from '@axonivy/process-editor-inscription-core';
import type { MonacoLanguageClient } from 'monaco-languageclient';
import { ThemeProvider, Spinner, Flex } from '@axonivy/ui-components';
import { createRoot } from 'react-dom/client';
import './index.css';
import { URLParams } from './url-helper';
import * as React from 'react';
import { webSocketConnection, type Connection } from '@axonivy/jsonrpc';
import { App, ClientContextProvider, initQueryClient, MonacoEditorUtil, QueryProvider } from '@axonivy/process-editor-inscription-view';
import { initTranslation } from './i18n';

export async function start(): Promise<void> {
  const server = URLParams.webSocketBase();
  const app = URLParams.app();
  const pmv = URLParams.pmv();
  const pid = URLParams.pid();
  const theme = URLParams.themeMode();
  const queryClient = initQueryClient();
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('root element not found');
  }
  const root = createRoot(rootElement);
  initTranslation();

  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme={theme}>
        <Flex style={{ height: '100%' }} justifyContent='center' alignItems='center'>
          <Spinner size='large' />
        </Flex>
      </ThemeProvider>
    </React.StrictMode>
  );

  const initialize = async (connection: Connection) => {
    const client = await InscriptionClientJsonRpc.startClient(connection);
    root.render(
      <React.StrictMode>
        <ThemeProvider defaultTheme={theme}>
          <ClientContextProvider client={client}>
            <QueryProvider client={queryClient}>
              <App app={app} pmv={pmv} pid={pid} />
            </QueryProvider>
          </ClientContextProvider>
        </ThemeProvider>
      </React.StrictMode>
    );
    return client;
  };

  const reconnect = async (connection: Connection, oldClient: InscriptionClientJsonRpc) => {
    await oldClient.stop();
    return initialize(connection);
  };

  webSocketConnection<InscriptionClientJsonRpc>(InscriptionClientJsonRpc.webSocketUrl(server)).listen({
    onConnection: initialize,
    onReconnect: reconnect,
    logger: console
  });

  const instance = MonacoEditorUtil.configureInstance({ theme, debug: true });

  const initializeScript = async (connection: Connection) => {
    return await IvyScriptLanguage.startClient(connection, instance);
  };

  const reconnectScript = async (connection: Connection, oldClient: MonacoLanguageClient) => {
    try {
      await oldClient.stop(0);
    } catch (error) {
      console.warn(error);
    }
    return initializeScript(connection);
  };

  webSocketConnection<MonacoLanguageClient>(IvyScriptLanguage.webSocketUrl(server)).listen({
    onConnection: initializeScript,
    onReconnect: reconnectScript,
    logger: console
  });
}

start();
