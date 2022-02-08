export function getServerDomain(): string {
  const protocol = window.location.protocol;
  if (protocol.startsWith('http')) {
    const href = window.location.href;
    return href.substring(protocol.length + 2, href.indexOf('/process-editor'));
  }
  return 'localhost:8081/designer';
}

export function isSecureConnection(): boolean {
  return window.location.protocol === 'https:' || getParameters()['secure'] === 'true';
}

export function isReadonly(): boolean {
  return getParameters()['readonly'] === 'true';
}

export function getParameters(): { [key: string]: string } {
  let search = window.location.search.substring(1);
  const result = {};
  while (search.length > 0) {
    const nextParamIndex = search.indexOf('&');
    let param: string;
    if (nextParamIndex < 0) {
      param = search;
      search = '';
    } else {
      param = search.substring(0, nextParamIndex);
      search = search.substring(nextParamIndex + 1);
    }
    const valueIndex = param.indexOf('=');
    if (valueIndex > 0 && valueIndex < param.length - 1) {
      result[param.substring(0, valueIndex)] = decodeURIComponent(param.substring(valueIndex + 1));
    }
  }
  return result;
}
