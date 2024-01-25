import { isBoundsAwareMoveable, ISnapper, Point, GModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyGridSnapper implements ISnapper {
  public static GRID_X = 8;
  public static GRID_Y = 8;

  snap(position: Point, element: GModelElement): Point {
    let width = 0;
    let height = 0;
    if (element && isBoundsAwareMoveable(element)) {
      width = element.bounds.width / 2;
      height = element.bounds.height / 2;
    }
    return {
      x: Math.round((position.x + width) / IvyGridSnapper.GRID_X) * IvyGridSnapper.GRID_X - width,
      y: Math.round((position.y + height) / IvyGridSnapper.GRID_Y) * IvyGridSnapper.GRID_Y - height
    };
  }
}
