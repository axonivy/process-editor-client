import {
  ChangeBoundsTool,
  MouseListener,
  ChangeBoundsListener,
  SModelElement,
  Operation,
  Action,
  SetUIExtensionVisibilityAction,
  FeedbackMoveMouseListener
} from '@eclipse-glsp/client';
import { SelectionListener } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { injectable } from 'inversify';
import { QuickActionUI } from '../ui-tools/quick-action/quick-action-ui';

@injectable()
export class IvyChangeBoundsTool extends ChangeBoundsTool {
  protected createChangeBoundsListener(): MouseListener & SelectionListener {
    return new IvyChangeBoundsListener(this);
  }

  protected createMoveMouseListener(): MouseListener {
    return new IvyFeedbackMoveMouseListener(this);
  }
}

export class IvyChangeBoundsListener extends ChangeBoundsListener {
  protected handleMoveRoutingPointsOnServer(target: SModelElement): Operation[] {
    return [];
  }

  mouseMove(target: SModelElement, event: MouseEvent): Action[] {
    const actions = super.mouseMove(target, event);
    if (this.isMouseDrag) {
      actions.push(
        SetUIExtensionVisibilityAction.create({
          extensionId: QuickActionUI.ID,
          visible: false
        })
      );
    }
    return actions;
  }
}

export class IvyFeedbackMoveMouseListener extends FeedbackMoveMouseListener {
  mouseMove(target: SModelElement, event: MouseEvent): Action[] {
    const actions = super.mouseMove(target, event);
    if (this.hasDragged) {
      actions.push(
        SetUIExtensionVisibilityAction.create({
          extensionId: QuickActionUI.ID,
          visible: false
        })
      );
    }
    return actions;
  }
}
