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

export function addCssClassToElements(elements: SModelElement[], cssClass: string): void {
  for (const element of elements) {
    addCssClass(element, cssClass);
  }
}

export function removeCssClassOfElements(elements: SModelElement[], cssClass: string): void {
  for (const element of elements) {
    removeCssClass(element, cssClass);
  }
}
