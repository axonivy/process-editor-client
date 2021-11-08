import {
  BoundsAware,
  IMovementRestrictor,
  isBoundsAware,
  Point,
  SChildElement,
  SModelElement,
  SNode,
  SParentElement,
  toAbsoluteBounds
} from '@eclipse-glsp/client';
import { LaneTypes } from 'src/diagram/view-types';

import { LaneNode } from '../diagram/model';

export class LaneMovmentRestrictor implements IMovementRestrictor {
  cssClasses = ['movement-not-allowed'];

  validate(newLocation: Point, element: SModelElement): boolean {
    if (!isBoundsAware(element) && !(element instanceof LaneNode)) {
      return false;
    }
    // Create ghost element at the newLocation
    const ghostElement = Object.create(element) as SModelElement & BoundsAware;
    ghostElement.bounds = {
      x: newLocation.x,
      y: newLocation.y,
      width: element.bounds.width,
      height: element.bounds.height
    };
    ghostElement.type = 'Ghost';
    ghostElement.id = element.id;

    const parentPool = getParentPool(element);
    if (parentPool) {
      return laneIsOutsidePool(ghostElement, parentPool) ||
        lanesAreOverlapping(ghostElement, parentPool.children);
    }
    Array.from(element.root.index.all()
      .filter(e => e.id !== ghostElement.id && e !== ghostElement.root && (e instanceof SNode))
      .map(e => e as SModelElement & BoundsAware)
    ).some(e => areOverlapping(e, ghostElement));
    return lanesAreOverlapping(ghostElement, tbd);
  }
  //   return !Array.from(element.root.index.all()
  // .filter(e => e.id !== ghostElement.id)
  // .filter(e => e !== ghostElement.root)
  // .filter(e => e instanceof LaneNode)
  // .filter()
  // .map(e => e as SModelElement & BoundsAware))
  //     .some(e => areOverlapping(e, ghostElement));
  // }
}

function getParentPool(element: SModelElement & BoundsAware): SParentElement & BoundsAware | undefined {
  if (element.type === LaneTypes.LANE && element instanceof SChildElement &&
    isBoundsAware(element.parent) && element.parent.type === LaneTypes.POOL) {
    return element.parent;
  }
  return undefined;
}

function laneIsOutsidePool(lane: SModelElement & BoundsAware, pool: SParentElement & BoundsAware): boolean {
  return lane.bounds.y < 0 ||
    lane.bounds.y + lane.bounds.height > pool.bounds.height;
}

function lanesAreOverlapping(lane: SModelElement & BoundsAware, lanes: readonly SChildElement[]): boolean {

  return Array.from(lanes
    .filter(e => e.id !== lane.id)
    .filter(l => l instanceof LaneNode)
    .filter(isBoundsAware)
    .map(l => l as SModelElement & BoundsAware))
    .some(l => areOverlapping(l, lane));
}

export function areOverlapping(element1: SModelElement & BoundsAware, element2: SModelElement & BoundsAware): boolean {
  const b1 = toAbsoluteBounds(element1);
  const b2 = toAbsoluteBounds(element2);
  const r1TopLeft: Point = b1;
  const r1BottomRight = { x: b1.x + b1.width, y: b1.y + b1.height };
  const r2TopLeft: Point = b2;
  const r2BottomRight = { x: b2.x + b2.width, y: b2.y + b2.height };

  // If one rectangle is on left side of other
  if (r1TopLeft.x > r2BottomRight.x || r2TopLeft.x > r1BottomRight.x) {
    return false;
  }

  // If one rectangle is above other
  if (r1BottomRight.y < r2TopLeft.y || r2BottomRight.y < r1TopLeft.y) {
    return false;
  }

  return true;

}
