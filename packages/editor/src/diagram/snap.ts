import { GridSnapper, Point } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyGridSnapper extends GridSnapper {
  public static GRID: Point = { x: 8, y: 8 };

  constructor() {
    super(IvyGridSnapper.GRID);
  }
}
