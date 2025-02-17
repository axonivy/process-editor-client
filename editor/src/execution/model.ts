import { SModelElement, type SModelExtension } from '@eclipse-glsp/client';

export const executionFeature = Symbol('executionFeature');

export interface Executable extends SModelExtension {
  executionCount?: number;
}

export function isExecutable(element: SModelElement): element is SModelElement {
  return element.hasFeature(executionFeature);
}
