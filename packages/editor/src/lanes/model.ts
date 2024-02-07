import {
  BoundsAware,
  Hoverable,
  hoverFeedbackFeature,
  isBoundsAware,
  isSelectable,
  isSelected,
  GChildElement,
  Selectable,
  GModelElement,
  GParentElement
} from '@eclipse-glsp/client';

export const laneResizeFeature = Symbol('laneResizeFeature');

export interface LaneResizable extends BoundsAware, Selectable {}

export function isLaneResizable(element: GModelElement): element is GParentElement & LaneResizable {
  return isBoundsAware(element) && isSelectable(element) && element instanceof GParentElement && element.hasFeature(laneResizeFeature);
}

export function isSelectedLane(element: GModelElement): element is GParentElement & LaneResizable {
  return isLaneResizable(element) && isSelected(element);
}

export enum LaneResizeHandleLocation {
  Top = 'top',
  Bottom = 'bottom'
}

export class SLaneResizeHandle extends GChildElement implements Hoverable {
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

export function isLaneResizeHandle(element: GModelElement): element is GParentElement {
  return element instanceof SLaneResizeHandle;
}

export function addLaneResizeHandles(element: GParentElement): void {
  removeLaneResizeHandles(element);
  element.add(new SLaneResizeHandle(LaneResizeHandleLocation.Top));
  element.add(new SLaneResizeHandle(LaneResizeHandleLocation.Bottom));
}

export function removeLaneResizeHandles(element: GParentElement): void {
  element.removeAll(child => child instanceof SLaneResizeHandle);
}
