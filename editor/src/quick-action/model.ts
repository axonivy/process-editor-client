import { BoundsAware, isBoundsAware, isSelectable, Selectable, SModelElement, SParentElement } from 'sprotty';

export const quickActionFeature = Symbol('quickActionFeature');

export interface QuickActionAware extends BoundsAware, Selectable {
}

export function isQuickActionAware(element: SModelElement): element is SParentElement & QuickActionAware {
  return isBoundsAware(element) && isSelectable(element) && element instanceof SParentElement && element.hasFeature(quickActionFeature);
}
