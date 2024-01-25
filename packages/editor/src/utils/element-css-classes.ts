import { distinctAdd, remove, GModelElement } from '@eclipse-glsp/client';

export function addCssClass(element: GModelElement, value: string): void {
  if (element.cssClasses === undefined) {
    element.cssClasses = [];
  }
  distinctAdd(element.cssClasses, value);
}

export function removeCssClass(element: GModelElement, value: string): void {
  if (element.cssClasses !== undefined) {
    remove(element.cssClasses, value);
  }
}

export function addCssClassToElements(elements: GModelElement[], cssClass: string): void {
  for (const element of elements) {
    addCssClass(element, cssClass);
  }
}

export function removeCssClassOfElements(elements: GModelElement[], cssClass: string): void {
  for (const element of elements) {
    removeCssClass(element, cssClass);
  }
}
