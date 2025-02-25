export function getServerDomain(): string {
  const protocol = window.location.protocol;
  if (protocol.startsWith('http')) {
    const href = window.location.href;
    return href.substring(protocol.length + 2, href.indexOf('/process-editor'));
  }
  return 'localhost:8081/designer';
}

export function isSecureConnection(): boolean {
  return window.location.protocol === 'https:' || getParameters().get('secure') === 'true';
}

export function isReadonly(): boolean {
  return getParameters().get('readonly') === 'true' || isInViewerMode() || isInPreviewMode();
}

export function isInViewerMode(): boolean {
  return getParameters().get('mode') === 'viewer';
}

export function isInPreviewMode(): boolean {
  return getParameters().get('mode') === 'preview';
}

export function getParameters(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}
