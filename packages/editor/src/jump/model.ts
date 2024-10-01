import { GModelElement } from '@eclipse-glsp/client';

export const jumpFeature = Symbol('jumpFeature');

export function isJumpable(element: GModelElement): element is GModelElement {
  return element.hasFeature(jumpFeature);
}
