import type { BoundsAware, GModelElement, Selectable } from '@eclipse-glsp/client';
import { isBoundsAware, isSelectable } from '@eclipse-glsp/client';
import { LaneNode } from '../diagram/model';

export const laneResizeFeature = Symbol('laneResizeFeature');

export interface LaneResizable extends BoundsAware, Selectable {}

export function isLaneResizable(element: GModelElement): element is LaneNode & LaneResizable {
  return isBoundsAware(element) && isSelectable(element) && element instanceof LaneNode;
}
