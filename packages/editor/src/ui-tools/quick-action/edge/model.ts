import { SModelElement } from '@eclipse-glsp/client';

export const multipleOutgoingEdgesFeature = Symbol('multipleOutgoingEdgesFeature');

export function isMultipleOutgoingEdgesFeature(element: SModelElement): element is SModelElement {
  return element.hasFeature(multipleOutgoingEdgesFeature);
}
