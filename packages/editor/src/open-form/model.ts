import type { GModelElement } from '@eclipse-glsp/client';

export const goToFormFeature = Symbol('goToFormFeature');

export function hasGoToFormFeautre(element: GModelElement): element is GModelElement {
  return element.hasFeature(goToFormFeature);
}
