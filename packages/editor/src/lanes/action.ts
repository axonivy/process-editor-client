import { CreateNodeOperation, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { StreamlineIcons } from '../StreamlineIcons';

import { LaneNode } from '../diagram/model';
import { LaneTypes } from '../diagram/view-types';
import { QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';

@injectable()
export class CreateLaneQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof LaneNode && element.type === LaneTypes.POOL) {
      return {
        icon: StreamlineIcons.LaneSwimlanes,
        title: 'Create Lane',
        location: 'Right',
        sorting: 'A',
        action: CreateNodeOperation.create(LaneTypes.LANE, { containerId: element.id })
      };
    }
    return undefined;
  }
}
