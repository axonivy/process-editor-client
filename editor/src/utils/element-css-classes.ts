import { distinctAdd, remove, SModelElement } from '@eclipse-glsp/client';

export function addCssClass(element: SModelElement, value: string): void {
  if (element.cssClasses === undefined) {
    element.cssClasses = [];
  }
  distinctAdd(element.cssClasses, value);
}

export function removeCssClass(element: SModelElement, value: string): void {
  if (element.cssClasses !== undefined) {
    remove(element.cssClasses, value);
  }
}
