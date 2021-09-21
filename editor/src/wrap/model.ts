import { SModelElement } from '@eclipse-glsp/client';

export const unwrapFeature = Symbol('unwrapFeature');

export function isUnWrapable(element: SModelElement): element is SModelElement {
  return element.hasFeature(unwrapFeature);
}
