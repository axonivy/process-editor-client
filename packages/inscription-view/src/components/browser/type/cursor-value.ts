import type { TypeBrowserObject } from './TypeBrowser';

export const getCursorValue = (value: TypeBrowserObject, isIvyType: boolean, typeAsList: boolean, inCodeBlock: boolean) => {
  if (isIvyType || inCodeBlock) {
    return typeAsList ? 'List<' + value.simpleName + '>' : value.simpleName;
  } else {
    return typeAsList ? 'List<' + value.fullQualifiedName + '>' : value.fullQualifiedName;
  }
};
