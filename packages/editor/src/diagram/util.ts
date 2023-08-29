export function escapeHtmlWithLineBreaks(text: string): string {
  'use strict';
  return text.replace(/[\\"&'\\/<>\n]/g, function (a) {
    return (
      {
        '"': '&quot;',
        '&': '&amp;',
        "'": '&#39;',
        '/': '&#47;',
        '<': '&lt;',
        '>': '&gt;',
        '\n': '<br/>'
      }[a] ?? ''
    );
  });
}
