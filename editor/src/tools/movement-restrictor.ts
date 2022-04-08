import { IMovementRestrictor, isBoundsAwareMoveable, Point, SModelElement } from '@eclipse-glsp/client';
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
    return newLocation.x >= 0 && newLocation.y >= 0;
  }
}
