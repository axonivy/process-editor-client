import { GModelElement, GridSnapper, Point } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyGridSnapper extends GridSnapper {
  public static GRID_X = 8;
  public static GRID_Y = 8;

  constructor() {
    super({ x: IvyGridSnapper.GRID_X, y: IvyGridSnapper.GRID_Y });
  }

  snap(delta: Point, _element: GModelElement): Point {
    return onGrid(delta, this.grid);
  }
}

export function onGrid(point: Point, grid: Point): Point {
  return {
    x: Math.trunc(point.x / grid.x) * grid.x,
    y: Math.trunc(point.y / grid.y) * grid.y
  };
}
