import { SModelElement } from '@eclipse-glsp/client';

export const errorBoundaryFeature = Symbol('errorBoundaryFeature');

export function canAddErrorBoundary(element: SModelElement): element is SModelElement {
  return element.hasFeature(errorBoundaryFeature);
}

export const signalBoundaryFeature = Symbol('signalBoundaryFeature');

export function canAddSignalBoundary(element: SModelElement): element is SModelElement {
  return element.hasFeature(signalBoundaryFeature);
}
