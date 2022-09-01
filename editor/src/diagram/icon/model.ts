import { openFeature, SModelElement, SModelExtension } from '@eclipse-glsp/client';

export interface WithCustomIcon extends SModelExtension {
  get customIcon(): string;
}

export function isWithCustomIcon(element: SModelElement): element is SModelElement & WithCustomIcon {
  return element.hasFeature(openFeature);
}
