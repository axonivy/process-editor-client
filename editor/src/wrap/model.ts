import { SModelElement } from '@eclipse-glsp/client';

export const unwrapFeature = Symbol('unwrapFeature');
export const wrapFeature = Symbol('wrapFeature');

export function isUnwrapable(element: SModelElement): element is SModelElement {
  return element.hasFeature(unwrapFeature);
}

export function isWrapable(element: SModelElement): element is SModelElement {
  return element.hasFeature(wrapFeature);
}
