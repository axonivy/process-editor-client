import { injectable } from 'inversify';
import { Decoration, DecorationPlacer, isSizeable, Point, SChildElement, SModelElement } from '@eclipse-glsp/client';
import { ActivityNode } from '../diagram/model';

@injectable()
export class IvyDecorationPlacer extends DecorationPlacer {
  protected static readonly DECORATOR_RADIUS: number = 6;

  getPosition(element: SModelElement & Decoration): Point {
    if (element instanceof SChildElement && isSizeable(element.parent)) {
      if (element.parent instanceof ActivityNode) {
        return {
          x: element.parent.bounds.width / 2 - IvyDecorationPlacer.DECORATOR_RADIUS,
          y: 3
        };
      }
      return {
        x: element.parent.bounds.width / 2 - IvyDecorationPlacer.DECORATOR_RADIUS,
        y: element.parent.bounds.height - IvyDecorationPlacer.DECORATOR_RADIUS
      };
    }
    return Point.ORIGIN;
  }
}
