import { CreateNodeOperation, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

import { LaneNode } from '../diagram/model';
import { LaneTypes } from '../diagram/view-types';
import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';

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
    public readonly icon = 'si si-lane-swimlanes',
    public readonly title = 'Create Lane',
    public readonly location = QuickActionLocation.Right,
    public readonly sorting = 'A',
    public readonly action = CreateNodeOperation.create(LaneTypes.LANE, { containerId: poolId })
  ) {}
}
