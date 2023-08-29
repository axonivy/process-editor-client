import { SModelElement } from '@eclipse-glsp/client';

export const jumpFeature = Symbol('jumpFeature');

export function isJumpable(element: SModelElement): element is SModelElement {
  return element.hasFeature(jumpFeature);
}

export const goToSourceFeature = Symbol('goToSourceFeature');

export function hasGoToSourceFeature(element: SModelElement): element is SModelElement {
  return element.hasFeature(goToSourceFeature);
}
