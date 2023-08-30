import { SEdge, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { StreamlineIcons } from '../StreamlineIcons';
import { QuickActionTriggerEdgeCreationAction } from '../ui-tools/quick-action/edge/edge-creation-tool';

import { QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { AutoBendEdgeOperation, StraightenEdgeOperation } from '@axonivy/process-editor-protocol';

@injectable()
export class StraightenEdgeQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof SEdge) {
      return {
        icon: StreamlineIcons.Straighten,
        title: 'Straighten (S)',
        location: 'Middle',
        sorting: 'A',
        action: StraightenEdgeOperation.create({ elementId: element.id }),
        shortcut: 'KeyS'
      };
    }
    return undefined;
  }
}

@injectable()
export class AutoBendEdgeQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof SEdge) {
      return {
        icon: StreamlineIcons.Bend,
        title: 'Bend (B)',
        location: 'Middle',
        sorting: 'B',
        action: AutoBendEdgeOperation.create({ elementId: element.id }),
        shortcut: 'KeyB'
      };
    }
    return undefined;
  }
}

@injectable()
export class ReconnectEdgeQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof SEdge) {
      return {
        icon: StreamlineIcons.Reconnect,
        title: 'Reconnect (R)',
        location: 'Right',
        sorting: 'A',
        action: QuickActionTriggerEdgeCreationAction.create(element.type, element.sourceId, { edgeId: element.id, reconnect: true }),
        shortcut: 'KeyR'
      };
    }
    return undefined;
  }
}
