export function getServerDomain(): string {
  const protocol = window.location.protocol;
  if (protocol.startsWith('http')) {
    const href = window.location.href;
    return href.substring(protocol.length + 2, href.indexOf('/process-editor'));
  }
  return 'localhost:8081';
}

export function isSecureConnection(): boolean {
  return window.location.protocol === 'https:' || getParameters().get('secure') === 'true';
}

export function isReadonly(): boolean {
  return getParameters().get('readonly') === 'true';
}

export function getParameters() {
  return new URLSearchParams(window.location.search);
}
