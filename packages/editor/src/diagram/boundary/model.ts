import { GModelElement } from '@eclipse-glsp/client';

export const errorBoundaryFeature = Symbol('errorBoundaryFeature');

export function canAddErrorBoundary(element: GModelElement): element is GModelElement {
  return element.hasFeature(errorBoundaryFeature);
}

export const signalBoundaryFeature = Symbol('signalBoundaryFeature');

export function canAddSignalBoundary(element: GModelElement): element is GModelElement {
  return element.hasFeature(signalBoundaryFeature);
}
