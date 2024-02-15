import {
  Action,
  ChangeBoundsListener,
  ChangeBoundsTool,
  CursorCSS,
  Disposable,
  FeedbackMoveMouseListener,
  GModelElement,
  IFeedbackEmitter,
  ISelectionListener,
  MouseListener,
  MoveAction,
  MoveInitializedEventAction,
  Operation,
  Point,
  createMovementRestrictionFeedback,
  cursorFeedbackAction,
  removeMovementRestrictionFeedback
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { debounce } from 'lodash';
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

  registerFeedback(
    feedbackActions: Action[],
    feedbackEmitter?: IFeedbackEmitter | undefined,
    cleanupActions?: Action[] | undefined
  ): Disposable {
    // elements should not be used as feedback emitters as a model update may re-create the element
    return super.registerFeedback(
      feedbackActions,
      feedbackEmitter instanceof GModelElement ? feedbackEmitter.id : feedbackEmitter,
      cleanupActions
    );
  }

  deregisterFeedback(feedbackEmitter?: IFeedbackEmitter | undefined, cleanupActions?: Action[] | undefined): void {
    // elements should not be used as feedback emitters as a model update may re-create the element
    return super.deregisterFeedback(feedbackEmitter instanceof GModelElement ? feedbackEmitter.id : feedbackEmitter, cleanupActions);
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

  mouseDown(target: GModelElement, event: MouseEvent): Action[] {
    this._isMouseDown = true;
    return super.mouseDown(target, event);
  }

  protected scheduleMoveInitialized(): void {
    this.moveInitialized = false;
    this.pendingMoveInitialized?.cancel();
    this.pendingMoveInitialized = debounce(() => {
      // nicer UX to only count a move as initialized if we actually keep the mouse pressed
      if (this.isMouseDown) {
        this.tool.registerFeedback([MoveInitializedEventAction.create()], this);
        this.moveInitialized = true;
      }
      this.pendingMoveInitialized = undefined;
    }, 750);
    this.pendingMoveInitialized();
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
    // overridden so we can properly reset the feedback if we have an invalid move
    const result: Action[] = [];
    if (this.positionUpdater.isLastDragPositionUndefined()) {
      this.reset(true);
      return result;
    } else {
      const moveAction = this.getElementMoves(target, event, true);
      if (moveAction) {
        result.push(moveAction);
      }
      const resetFeedback: Action[] = [];
      if (this.tool.movementRestrictor) {
        resetFeedback.push(removeMovementRestrictionFeedback(target, this.tool.movementRestrictor));
      }
      resetFeedback.push(cursorFeedbackAction(CursorCSS.DEFAULT));
      this.tool.deregisterFeedback(this, resetFeedback);
    }
    // check if we have an invalid move and if so properly reset the move feedback
    if (this.tool.movementRestrictor?.cssClasses) {
      for (const [elementId] of this.elementId2startPos) {
        const element = target.root.index.getById(elementId);
        if (element && this.isMovementRestricted(element, this.tool.movementRestrictor.cssClasses)) {
          this.reset(true);
          this.tool.deregisterFeedback(this, [removeMovementRestrictionFeedback(element, this.tool.movementRestrictor)]);
          return result;
        }
      }
    }
    this.reset();
    return result;
  }

  nonDraggingMouseUp(element: GModelElement, event: MouseEvent): Action[] {
    if (this.moveInitialized) {
      super.nonDraggingMouseUp(element, event);
    }
    return [];
  }

  protected isMovementRestricted(target: GModelElement | undefined, restrictionClasses: string[]): boolean {
    return target?.cssClasses ? restrictionClasses.some(cssClass => target.cssClasses?.includes(cssClass)) : false;
  }

  protected getElementMoves(target: GModelElement, event: MouseEvent, finished: boolean): MoveAction | undefined {
    this.lastMove = super.getElementMoves(target, event, finished);
    return this.lastMove;
  }

  hasRealMoved(): boolean {
    return !!this.lastMove?.moves.some(move => move.fromPosition && !Point.equals(move.fromPosition, move.toPosition));
  }

  protected validateMove(startPosition: Point, toPosition: Point, element: GModelElement, isFinished: boolean): Point {
    let newPosition = toPosition;
    if (this.tool.movementRestrictor) {
      const action: Action[] = [];
      if (this.tool.movementRestrictor.validate(element, toPosition)) {
        action.push(removeMovementRestrictionFeedback(element, this.tool.movementRestrictor));
      } else {
        if (isFinished) {
          newPosition = startPosition;
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
