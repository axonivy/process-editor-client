import { GModelElement } from '@eclipse-glsp/client';

export const jumpFeature = Symbol('jumpFeature');

export function isJumpable(element: GModelElement): element is GModelElement {
  return element.hasFeature(jumpFeature);
}

export const goToSourceFeature = Symbol('goToSourceFeature');

export function hasGoToSourceFeature(element: GModelElement): element is GModelElement {
  return element.hasFeature(goToSourceFeature);
}
