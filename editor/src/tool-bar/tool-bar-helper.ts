import { PaletteItem } from '@eclipse-glsp/client';

export function createIcon(cssClasses: string[]): HTMLElement {
  const icon = document.createElement('i');
  const classes = cssClasses.map(cssClass => cssClass.split(' ')).flat();
  icon.classList.add(...classes);
  return icon;
}

export function compare(a: PaletteItem, b: PaletteItem): number {
  const sortStringBased = a.sortString.localeCompare(b.sortString);
  if (sortStringBased !== 0) {
    return sortStringBased;
  }
  return a.label.localeCompare(b.label);
}

export function changeCSSClass(element: Element, css: string): void {
  element.classList.contains(css) ? element.classList.remove(css) : element.classList.add(css);
}
