import { SModelElement } from '@eclipse-glsp/client';

export const unwrapFeature = Symbol('unwrapFeature');

export function isUnwrapable(element: SModelElement): element is SModelElement {
  return element.hasFeature(unwrapFeature);
}
