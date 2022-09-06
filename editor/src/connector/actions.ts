import { Operation, SEdge, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { KeyCode } from 'sprotty/lib/utils/keyboard';
import { StreamlineIcons } from '../StreamlineIcons';
import { QuickActionTriggerEdgeCreationAction } from '../ui-tools/quick-action/edge/edge-creation-tool';

import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';

export interface StraightenEdgeOperation extends Operation {
  kind: typeof StraightenEdgeOperation.KIND;
  elementId: string;
}

export namespace StraightenEdgeOperation {
  export const KIND = 'straightenEdge';

  export function create(options: { elementId: string }): StraightenEdgeOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}

@injectable()
export class StraightenEdgeQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof SEdge) {
      return new StraightenEdgeQuickAction(element.id);
    }
    return undefined;
  }
}

class StraightenEdgeQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = StreamlineIcons.Straighten,
    public readonly title = 'Straighten (S)',
    public readonly location = QuickActionLocation.Middle,
    public readonly sorting = 'A',
    public readonly action = StraightenEdgeOperation.create({ elementId: elementId }),
    public readonly shortcut: KeyCode = 'KeyS'
  ) {}
}

export interface AutoBendEdgeOperation extends Operation {
  kind: typeof AutoBendEdgeOperation.KIND;
  elementId: string;
}

export namespace AutoBendEdgeOperation {
  export const KIND = 'autoBendEdge';

  export function create(options: { elementId: string }): AutoBendEdgeOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}

@injectable()
export class AutoBendEdgeQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof SEdge) {
      return new AutoBendEdgeQuickAction(element.id);
    }
    return undefined;
  }
}

class AutoBendEdgeQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = StreamlineIcons.Bend,
    public readonly title = 'Bend (B)',
    public readonly location = QuickActionLocation.Middle,
    public readonly sorting = 'B',
    public readonly action = AutoBendEdgeOperation.create({ elementId: elementId }),
    public readonly shortcut: KeyCode = 'KeyB'
  ) {}
}

@injectable()
export class ReconnectEdgeQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof SEdge) {
      return new ReconnectEdgeQuickAction(element);
    }
    return undefined;
  }
}

class ReconnectEdgeQuickAction implements QuickAction {
  constructor(
    public readonly edge: SEdge,
    public readonly icon = StreamlineIcons.Reconnect,
    public readonly title = 'Reconnect (R)',
    public readonly location = QuickActionLocation.Right,
    public readonly sorting = 'A',
    public readonly action = QuickActionTriggerEdgeCreationAction.create(edge.type, edge.sourceId, {
      edgeId: edge.id,
      reconnect: true
    }),
    public readonly shortcut: KeyCode = 'KeyR'
  ) {}
}
