import {
  ChangeBoundsTool,
  MouseListener,
  ChangeBoundsListener,
  SModelElement,
  Operation,
  Action,
  SetUIExtensionVisibilityAction,
  FeedbackMoveMouseListener,
  MoveAction,
  Point,
  type ElementMove,
  createMovementRestrictionFeedback,
  removeMovementRestrictionFeedback
} from '@eclipse-glsp/client';
import type { SelectionListener } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { injectable } from 'inversify';
import { QuickActionUI } from '../ui-tools/quick-action/quick-action-ui';
import { addNegativeArea, removeNegativeArea } from './negative-area/model';

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
    if (this.isMouseDrag && this.activeResizeHandle) {
      actions.push(
        SetUIExtensionVisibilityAction.create({
          extensionId: QuickActionUI.ID,
          visible: false
        })
      );
      addNegativeArea(target);
    }
    return actions;
  }

  draggingMouseUp(target: SModelElement, event: MouseEvent): Action[] {
    const actions = super.draggingMouseUp(target, event);
    removeNegativeArea(target);
    return actions;
  }
}

export class IvyFeedbackMoveMouseListener extends FeedbackMoveMouseListener {
  mouseMove(target: SModelElement, event: MouseEvent): Action[] {
    if (event.buttons === 0) {
      removeNegativeArea(target);
      return this.mouseUp(target, event);
    }
    const actions = super.mouseMove(target, event);
    if (this.hasDragged && this.hasRealMoved(actions)) {
      actions.push(
        SetUIExtensionVisibilityAction.create({
          extensionId: QuickActionUI.ID,
          visible: false
        })
      );
      addNegativeArea(target);
    }
    return actions;
  }

  hasRealMoved(actions: Action[]): ElementMove | undefined {
    return actions
      .filter(action => action.kind === MoveAction.KIND)
      .flatMap(action => (<MoveAction>action).moves)
      .find(move => move.fromPosition && !Point.equals(move.fromPosition, move.toPosition));
  }

  protected validateMove(startPostion: Point, toPosition: Point, element: SModelElement, isFinished: boolean): Point {
    let newPosition = toPosition;
    if (this.tool.movementRestrictor) {
      const action: Action[] = [];
      if (this.tool.movementRestrictor.validate(element, toPosition)) {
        action.push(removeMovementRestrictionFeedback(element, this.tool.movementRestrictor));
      } else {
        if (isFinished) {
          newPosition = startPostion;
          action.push(removeMovementRestrictionFeedback(element, this.tool.movementRestrictor));
        } else {
          action.push(createMovementRestrictionFeedback(element, this.tool.movementRestrictor));
        }
      }
      this.tool.dispatchFeedback(action, this);
    }
    return newPosition;
  }
}
