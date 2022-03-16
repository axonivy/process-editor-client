import { SModelElement } from '@eclipse-glsp/client';

export const jumpFeature = Symbol('jumpFeature');

export function isJumpable(element: SModelElement): element is SModelElement {
  return element.hasFeature(jumpFeature);
}

export const editSourceFeature = Symbol('editSourceFeature');

export function hasEditSourceFeature(element: SModelElement): element is SModelElement {
  return element.hasFeature(editSourceFeature);
}
