import { SModelElement } from '@eclipse-glsp/client';

export const animateFeature = Symbol('animateFeature');

export function isAnimateable(element: SModelElement): element is SModelElement {
  return element.hasFeature(animateFeature);
}
