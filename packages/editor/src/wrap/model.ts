import { GModelElement } from '@eclipse-glsp/client';

export const unwrapFeature = Symbol('unwrapFeature');
export const wrapFeature = Symbol('wrapFeature');
export const singleWrapFeature = Symbol('singleWrapFeature');

export function isUnwrapable(element: GModelElement): element is GModelElement {
  return element.hasFeature(unwrapFeature);
}

export function isWrapable(element: GModelElement): element is GModelElement {
  return element.hasFeature(wrapFeature);
}

export function isSingleWrapable(element: GModelElement): element is GModelElement {
  return element.hasFeature(singleWrapFeature);
}
