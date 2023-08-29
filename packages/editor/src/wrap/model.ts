import { SModelElement } from '@eclipse-glsp/client';

export const unwrapFeature = Symbol('unwrapFeature');
export const wrapFeature = Symbol('wrapFeature');
export const singleWrapFeature = Symbol('singleWrapFeature');

export function isUnwrapable(element: SModelElement): element is SModelElement {
  return element.hasFeature(unwrapFeature);
}

export function isWrapable(element: SModelElement): element is SModelElement {
  return element.hasFeature(wrapFeature);
}

export function isSingleWrapable(element: SModelElement): element is SModelElement {
  return element.hasFeature(singleWrapFeature);
}
