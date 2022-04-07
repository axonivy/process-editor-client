import { IMovementRestrictor, isBoundsAwareMoveable, Point, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyMovementRestrictor implements IMovementRestrictor {
  cssClasses = ['movement-not-allowed'];

  validate(newLocation: Point, element: SModelElement): boolean {
    if (!isBoundsAwareMoveable(element)) {
      return false;
    }
    return newLocation.x >= 0 && newLocation.y >= 0;
  }
}
