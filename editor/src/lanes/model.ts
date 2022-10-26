import {
  BoundsAware,
  Hoverable,
  hoverFeedbackFeature,
  isBoundsAware,
  isSelectable,
  isSelected,
  SChildElement,
  Selectable,
  SModelElement,
  SParentElement
} from '@eclipse-glsp/client';

export const laneResizeFeature = Symbol('laneResizeFeature');

export interface LaneResizable extends BoundsAware, Selectable {}

export function isLaneResizable(element: SModelElement): element is SParentElement & LaneResizable {
  return isBoundsAware(element) && isSelectable(element) && element instanceof SParentElement && element.hasFeature(laneResizeFeature);
}

export function isSelectedLane(element: SModelElement): element is SParentElement & LaneResizable {
  return isLaneResizable(element) && isSelected(element);
}

export enum LaneResizeHandleLocation {
  Top = 'top',
  Bottom = 'bottom'
}

export class SLaneResizeHandle extends SChildElement implements Hoverable {
  static readonly TYPE = 'lane-resize-handle';

  constructor(
    public readonly location?: LaneResizeHandleLocation,
    public readonly type: string = SLaneResizeHandle.TYPE,
    public readonly hoverFeedback: boolean = false
  ) {
    super();
  }

  hasFeature(feature: symbol): boolean {
    return feature === hoverFeedbackFeature;
  }
}

export function isLaneResizeHandle(element: SModelElement): element is SParentElement {
  return element instanceof SLaneResizeHandle;
}

export function addLaneResizeHandles(element: SParentElement): void {
  removeLaneResizeHandles(element);
  element.add(new SLaneResizeHandle(LaneResizeHandleLocation.Top));
  element.add(new SLaneResizeHandle(LaneResizeHandleLocation.Bottom));
}

export function removeLaneResizeHandles(element: SParentElement): void {
  element.removeAll(child => child instanceof SLaneResizeHandle);
}
