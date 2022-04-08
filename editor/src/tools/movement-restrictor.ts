import { IMovementRestrictor, isBoundsAware, isBoundsAwareMoveable, Point, SChildElement, SModelElement } from '@eclipse-glsp/client';
import { ORIGIN_POINT } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';
import { isLaneResizable } from '../lanes/model';

@injectable()
export class IvyMovementRestrictor implements IMovementRestrictor {
  cssClasses = ['movement-not-allowed'];

  validate(newLocation: Point, element: SModelElement): boolean {
    if (isLaneResizable(element)) {
      return true;
    }
    if (!isBoundsAwareMoveable(element)) {
      return false;
    }
    const parentLocation = this.parentLocation(element, ORIGIN_POINT);
    return parentLocation.x + newLocation.x >= 0 && parentLocation.y + newLocation.y >= 0;
  }

  private parentLocation(element: SModelElement, location: Point): Point {
    if (element instanceof SChildElement) {
      const parent = element.parent;
      if (isBoundsAware(parent)) {
        return this.parentLocation(parent, { x: location.x + parent.bounds.x, y: location.y + parent.bounds.y });
      }
    }
    return location;
  }
}
