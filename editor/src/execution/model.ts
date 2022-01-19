import { SModelElement, SModelExtension } from '@eclipse-glsp/client';

export const executionFeature = Symbol('executionFeature');

export type Executable = SModelExtension;

export function isExecutable(element: SModelElement): element is SModelElement {
  return element.hasFeature(executionFeature);
}
