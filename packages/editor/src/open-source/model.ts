import { GModelElement } from '@eclipse-glsp/client';

export const goToSourceFeature = Symbol('goToSourceFeature');

export function hasGoToSourceFeature(element: GModelElement): element is GModelElement {
  return element.hasFeature(goToSourceFeature);
}
