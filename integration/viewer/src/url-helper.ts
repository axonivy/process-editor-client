import type { ThemeMode } from '@axonivy/process-editor-protocol';

export const params = (url: URL, defaultTheme?: () => ThemeMode) => {
  const parameters = new URLSearchParams(url.search);
  const app = parameters.get('app') ?? 'designer';
  let server = parameters.get('server');
  if (!server) {
    server = serverDomain(url, app);
  }
  const secure = parameters.get('secure') === 'true';
  const webSocketBase = `${url.protocol === 'https:' || secure ? 'wss' : 'ws'}://${server}/`;
  const webSocketUrl = `${webSocketBase}${app}`;
  return {
    webSocketUrl,
    app,
    pmv: parameters.get('pmv') ?? '',
    pid: parameters.get('pid') ?? '',
    sourceUri: parameters.get('file') ?? '',
    highlight: parameters.get('highlight') ?? '',
    select: parameters.get('select'),
    zoom: parameters.get('zoom') ?? '',
    theme: (parameters.get('theme') as ThemeMode) ?? defaultTheme?.(),
    previewMode: parameters.get('mode') === 'preview'
  };
};

const serverDomain = (url: URL, app: string) => {
  const protocol = url.protocol;
  if (protocol.startsWith('http')) {
    const href = url.href;
    return href.substring(protocol.length + 2, href.indexOf(`/${app}/process-viewer`));
  }
  return 'localhost:8081';
};
