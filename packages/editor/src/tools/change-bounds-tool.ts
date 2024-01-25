import {
  Action,
  ChangeBoundsListener,
  ChangeBoundsTool,
  FeedbackMoveMouseListener,
  GModelElement,
  ISelectionListener,
  MouseListener,
  MoveAction,
  Operation,
  Point,
  SetUIExtensionVisibilityAction,
  createMovementRestrictionFeedback,
  removeMovementRestrictionFeedback
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { QuickActionUI } from '../ui-tools/quick-action/quick-action-ui';
import { addNegativeArea, removeNegativeArea } from './negative-area/model';

@injectable()
export class IvyChangeBoundsTool extends ChangeBoundsTool {
  protected override createChangeBoundsListener(): MouseListener & ISelectionListener {
    return new IvyChangeBoundsListener(this);
  }

  protected override createMoveMouseListener(): MouseListener {
    return new IvyFeedbackMoveMouseListener(this);
  }
}

export class IvyChangeBoundsListener extends ChangeBoundsListener {
  protected handleMoveRoutingPointsOnServer(target: GModelElement): Operation[] {
    return [];
  }

  mouseMove(target: GModelElement, event: MouseEvent): Action[] {
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

  draggingMouseUp(target: GModelElement, event: MouseEvent): Action[] {
    const actions = super.draggingMouseUp(target, event);
    removeNegativeArea(target);
    return actions;
  }
}

export class IvyFeedbackMoveMouseListener extends FeedbackMoveMouseListener {
  protected lastMove: MoveAction | undefined;

  mouseMove(target: GModelElement, event: MouseEvent): Action[] {
    if (event.buttons === 0) {
      removeNegativeArea(target);
      return this.mouseUp(target, event);
    }
    this.lastMove = undefined;
    const actions = super.mouseMove(target, event);
    if (this._isMouseDrag && this.hasRealMoved()) {
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

  protected getElementMoves(target: GModelElement, event: MouseEvent, finished: boolean): MoveAction | undefined {
    this.lastMove = super.getElementMoves(target, event, finished);
    return this.lastMove;
  }

  hasRealMoved(): boolean {
    return !!this.lastMove?.moves.some(move => move.fromPosition && !Point.equals(move.fromPosition, move.toPosition));
  }

  protected validateMove(startPostion: Point, toPosition: Point, element: GModelElement, isFinished: boolean): Point {
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
      this.tool.registerFeedback(action, this);
    }
    return newPosition;
  }
}
