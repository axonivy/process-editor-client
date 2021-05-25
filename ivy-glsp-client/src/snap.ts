import { SShapeElement } from '@eclipse-glsp/client';
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
        if (element instanceof SShapeElement) {
            width = element.size.width / 2;
            height = element.size.height / 2;
        }
        return {
            x: Math.round((position.x + width) / this.gridX) * this.gridX - width,
            y: Math.round((position.y + height) / this.gridY) * this.gridY - height
        };
    }
}
