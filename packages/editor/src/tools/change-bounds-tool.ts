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
  createMovementRestrictionFeedback,
  removeMovementRestrictionFeedback
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { QuickActionUI } from '../ui-tools/quick-action/quick-action-ui';
import { addNegativeArea, removeNegativeArea } from './negative-area/model';

@injectable()
export class IvyChangeBoundsTool extends ChangeBoundsTool {
  @inject(QuickActionUI) quickActionUi: QuickActionUI;

  protected override createChangeBoundsListener(): MouseListener & ISelectionListener {
    return new IvyChangeBoundsListener(this);
  }

  protected override createMoveMouseListener(): MouseListener {
    return new IvyFeedbackMoveMouseListener(this);
  }
}

export class IvyChangeBoundsListener extends ChangeBoundsListener {
  constructor(protected override tool: IvyChangeBoundsTool) {
    super(tool);
  }

  protected handleMoveRoutingPointsOnServer(target: GModelElement): Operation[] {
    return [];
  }

  mouseMove(target: GModelElement, event: MouseEvent): Action[] {
    const actions = super.mouseMove(target, event);
    if (event.buttons !== 0 && this.isMouseDrag && this.activeResizeHandle) {
      this.tool.quickActionUi.hideUi();
      addNegativeArea(target);
    }
    return actions;
  }

  draggingMouseUp(target: GModelElement, event: MouseEvent): Action[] {
    const actions = super.draggingMouseUp(target, event);
    removeNegativeArea(target);
    this.tool.quickActionUi.showUi();
    return actions;
  }
}

export class IvyFeedbackMoveMouseListener extends FeedbackMoveMouseListener {
  protected lastMove: MoveAction | undefined;

  constructor(protected override tool: IvyChangeBoundsTool) {
    super(tool);
  }

  mouseMove(target: GModelElement, event: MouseEvent): Action[] {
    this.lastMove = undefined;
    const actions = super.mouseMove(target, event);
    if (event.buttons !== 0 && this._isMouseDrag && this.hasRealMoved()) {
      this.tool.quickActionUi.hideUi();
      addNegativeArea(target);
    }
    return actions;
  }

  draggingMouseUp(target: GModelElement, event: MouseEvent): Action[] {
    const actions = super.draggingMouseUp(target, event);
    this.tool.quickActionUi.showUi();
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
