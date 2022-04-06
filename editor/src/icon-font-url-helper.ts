export function appendIconFontToDom(baseContextUrl: string): void {
  const headHTML = document.getElementsByTagName('head')[0] as HTMLElement;
  const link = document.createElement('link');
  link.setAttribute('type', 'text/css');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', `${baseContextUrl}/webjars/font-awesome/6.1.0/css/all.min.css`);
  headHTML.appendChild(link);
}
