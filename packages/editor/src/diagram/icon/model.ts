import { GModelElement, openFeature } from '@eclipse-glsp/client';

export interface WithCustomIcon {
  get customIcon(): string;
}

export function isWithCustomIcon(element: GModelElement): element is GModelElement & WithCustomIcon {
  return element.hasFeature(openFeature);
}
