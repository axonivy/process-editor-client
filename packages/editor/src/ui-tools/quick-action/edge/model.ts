import { GModelElement } from '@eclipse-glsp/client';

export const multipleOutgoingEdgesFeature = Symbol('multipleOutgoingEdgesFeature');

export function isMultipleOutgoingEdgesFeature(element: GModelElement): element is GModelElement {
  return element.hasFeature(multipleOutgoingEdgesFeature);
}
