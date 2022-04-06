import { CreateNodeOperation, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

import { LaneNode } from '../diagram/model';
import { LaneTypes } from '../diagram/view-types';
import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../quick-action/quick-action';

@injectable()
export class CreateLaneQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof LaneNode && element.type === LaneTypes.POOL) {
      return new CreateLaneQuickAction(element.id);
    }
    return undefined;
  }
}

class CreateLaneQuickAction implements QuickAction {
  constructor(
    public readonly poolId: string,
    public readonly icon = 'fa-solid fa-table-columns fa-rotate-270',
    public readonly title = 'Create Lane',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'A',
    public readonly action = new CreateNodeOperation(LaneTypes.LANE, undefined, poolId)
  ) {}
}
