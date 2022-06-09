import { injectable } from 'inversify';
import { Decoration, DecorationPlacer, isSizeable, Point, SChildElement, SModelElement, SRoutableElement } from '@eclipse-glsp/client';

@injectable()
export class IvyDecorationPlacer extends DecorationPlacer {
  protected static readonly DECORATION_OFFSET: Point = { x: 8, y: 10 };

  getPosition(element: SModelElement & Decoration): Point {
    if (element instanceof SChildElement && element.parent instanceof SRoutableElement) {
      return super.getPosition(element);
    }
    if (element instanceof SChildElement && isSizeable(element.parent)) {
      return {
        x: IvyDecorationPlacer.DECORATION_OFFSET.x * -1,
        y: element.parent.bounds.height - IvyDecorationPlacer.DECORATION_OFFSET.y
      };
    }
    if (isSizeable(element)) {
      return {
        x: IvyDecorationPlacer.DECORATION_OFFSET.x * element.bounds.width,
        y: IvyDecorationPlacer.DECORATION_OFFSET.y * element.bounds.height
      };
    }
    return Point.ORIGIN;
  }
}
