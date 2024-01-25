import { GridSnapper } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyGridSnapper extends GridSnapper {
  public static GRID_X = 8;
  public static GRID_Y = 8;

  constructor() {
    super({ x: IvyGridSnapper.GRID_X, y: IvyGridSnapper.GRID_Y });
  }
}
