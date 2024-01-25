import { GModelElement } from '@eclipse-glsp/client';

export const animateFeature = Symbol('animateFeature');

export function isAnimateable(element: GModelElement): element is GModelElement {
  return element.hasFeature(animateFeature);
}
