import { urlBuilder, type Connection } from '@axonivy/jsonrpc';

export namespace IvyScriptLanguage {
  export function webSocketUrl(url: string | URL) {
    return urlBuilder(url, 'ivy-script-lsp');
  }

  export async function startClient(connection: Connection, isMonacoReady: Promise<any>) {
    await isMonacoReady;
    const { MonacoLanguageClient } = await import('monaco-languageclient');
    const client = new MonacoLanguageClient({
      name: 'IvyScript Language Client',
      clientOptions: { documentSelector: [{ language: 'ivyScript' }, { language: 'ivyMacro' }] },
      connectionProvider: { get: async () => connection }
    });
    client.start();
    return client;
  }
}
