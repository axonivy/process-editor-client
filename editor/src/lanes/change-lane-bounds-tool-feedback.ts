import {
  createMovementRestrictionFeedback,
  FeedbackCommand,
  isNotUndefined,
  removeMovementRestrictionFeedback
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { VNode } from 'snabbdom/vnode';
import {
  Action,
  CommandExecutionContext,
  CommandReturn,
  ElementMove,
  findParentByFeature,
  isMoveable,
  isSelectable,
  isViewport,
  MouseListener,
  MoveAction,
  Point,
  SModelElement,
  SModelRoot,
  TYPES
} from 'sprotty';

import { ChangeLaneBoundsTool } from './change-lane-bounds-tool';
import { addLaneResizeHandles, isLaneResizable, removeLaneResizeHandles, SLaneResizeHandle } from './model';

export class ShowChangeLaneBoundsToolFeedbackAction implements Action {
  constructor(readonly elementId?: string, public readonly kind: string = ShowChangeLaneBoundsToolFeedbackCommand.KIND) { }
}

export class HideChangeLaneBoundsToolFeedbackAction implements Action {
  constructor(public readonly kind: string = HideChangeLaneBoundsToolFeedbackCommand.KIND) { }
}

@injectable()
export class ShowChangeLaneBoundsToolFeedbackCommand extends FeedbackCommand {
  static readonly KIND = 'showChangeLaneBoundsToolFeedback';

  @inject(TYPES.Action) protected action: ShowChangeLaneBoundsToolFeedbackAction;

  execute(context: CommandExecutionContext): CommandReturn {
    const index = context.root.index;
    index
      .all()
      .filter(isLaneResizable)
      .forEach(removeLaneResizeHandles);

    if (isNotUndefined(this.action.elementId)) {
      const resizeElement = index.getById(this.action.elementId);
      if (isNotUndefined(resizeElement) && isLaneResizable(resizeElement)) {
        addLaneResizeHandles(resizeElement);
      }
    }
    return context.root;
  }
}

@injectable()
export class HideChangeLaneBoundsToolFeedbackCommand extends FeedbackCommand {
  static readonly KIND = 'hideChangeLaneBoundsToolResizeFeedback';

  @inject(TYPES.Action) protected action: HideChangeLaneBoundsToolFeedbackAction;

  execute(context: CommandExecutionContext): CommandReturn {
    const index = context.root.index;
    index
      .all()
      .filter(isLaneResizable)
      .forEach(removeLaneResizeHandles);
    return context.root;
  }
}

export class LaneFeedbackMoveMouseListener extends MouseListener {
  protected hasDragged = false;
  protected startDragPosition: Point | undefined;
  protected elementId2startPos = new Map<string, Point>();

  constructor(protected tool: ChangeLaneBoundsTool) {
    super();
  }

  mouseDown(target: SModelElement, event: MouseEvent): Action[] {
    if (event.button === 0 && !(target instanceof SLaneResizeHandle)) {
      const moveable = findParentByFeature(target, isMoveable);
      if (moveable !== undefined) {
        this.startDragPosition = { x: event.pageX, y: event.pageY };
      } else {
        this.startDragPosition = undefined;
      }
      this.hasDragged = false;
    }
    return [];
  }

  mouseMove(target: SModelElement, event: MouseEvent): Action[] {
    const result: Action[] = [];
    if (event.buttons === 0) {
      this.mouseUp(target, event);
    } else if (this.startDragPosition) {
      if (this.elementId2startPos.size === 0) {
        this.collectStartPositions(target.root);
      }
      this.hasDragged = true;
      const moveAction = this.getElementMoves(target, event, false);
      if (moveAction) {
        result.push(moveAction);
      }
    }
    return result;
  }

  protected collectStartPositions(root: SModelRoot): void {
    root.index
      .all()
      .filter(element => isSelectable(element) && element.selected)
      .forEach(element => {
        if (isMoveable(element)) {
          this.elementId2startPos.set(element.id, element.position);
        }
      });
  }

  protected getElementMoves(target: SModelElement, event: MouseEvent, isFinished: boolean): MoveAction | undefined {
    if (!this.startDragPosition) {
      return undefined;
    }
    const elementMoves: ElementMove[] = [];
    const viewport = findParentByFeature(target, isViewport);
    const zoom = viewport ? viewport.zoom : 1;
    const delta = {
      x: (event.pageX - this.startDragPosition.x) / zoom,
      y: (event.pageY - this.startDragPosition.y) / zoom
    };
    this.elementId2startPos.forEach((startPosition, elementId) => {
      const element = target.root.index.getById(elementId);
      if (element) {
        let toPosition = this.snap(
          {
            x: startPosition.x + delta.x,
            y: startPosition.y + delta.y
          },
          element,
          !event.shiftKey
        );

        if (isMoveable(element)) {
          toPosition = this.validateMove(startPosition, toPosition, element, isFinished);
          elementMoves.push({
            elementId: element.id,
            fromPosition: {
              x: element.position.x,
              y: element.position.y
            },
            toPosition
          });
        }
      }
    });
    if (elementMoves.length > 0) {
      return new MoveAction(elementMoves, false, isFinished);
    } else {
      return undefined;
    }
  }

  protected validateMove(startPostion: Point, toPosition: Point, element: SModelElement, isFinished: boolean): Point {
    let newPosition = toPosition;
    if (this.tool.movementRestrictor) {
      const valid = this.tool.movementRestrictor.validate(toPosition, element);
      let action;
      if (!valid) {
        action = createMovementRestrictionFeedback(element, this.tool.movementRestrictor);

        if (isFinished) {
          newPosition = startPostion;
        }
      } else {
        action = removeMovementRestrictionFeedback(element, this.tool.movementRestrictor);
      }

      this.tool.dispatchFeedback([action], this);
    }
    return newPosition;
  }

  protected snap(position: Point, element: SModelElement, isSnap: boolean): Point {
    if (isSnap && this.tool.snapper) {
      return this.tool.snapper.snap(position, element);
    } else {
      return position;
    }
  }

  mouseEnter(target: SModelElement, event: MouseEvent): Action[] {
    if (target instanceof SModelRoot && event.buttons === 0) {
      this.mouseUp(target, event);
    }
    return [];
  }

  mouseUp(target: SModelElement, event: MouseEvent): Action[] {
    const result: Action[] = [];
    if (this.startDragPosition) {
      const moveAction = this.getElementMoves(target, event, true);
      if (moveAction) {
        result.push(moveAction);
      }
      if (this.tool.movementRestrictor) {
        this.tool.deregisterFeedback([removeMovementRestrictionFeedback(target, this.tool.movementRestrictor)], this);
      }

    }
    this.hasDragged = false;
    this.startDragPosition = undefined;
    this.elementId2startPos.clear();
    return result;
  }

  decorate(vnode: VNode, _element: SModelElement): VNode {
    return vnode;
  }
}
