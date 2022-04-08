import { isBoundsAwareMoveable } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { ISnapper, Point, SModelElement } from 'sprotty';

@injectable()
export class IvyGridSnapper implements ISnapper {
  get gridX(): number {
    return 8;
  }

  get gridY(): number {
    return 8;
  }

  snap(position: Point, element: SModelElement): Point {
    let width = 0;
    let height = 0;
    if (element && isBoundsAwareMoveable(element)) {
      width = element.bounds.width / 2;
      height = element.bounds.height / 2;
    }
    return {
      x: Math.round((position.x + width) / this.gridX) * this.gridX - width,
      y: Math.round((position.y + height) / this.gridY) * this.gridY - height
    };
  }
}
