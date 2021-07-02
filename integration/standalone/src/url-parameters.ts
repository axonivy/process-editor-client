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
