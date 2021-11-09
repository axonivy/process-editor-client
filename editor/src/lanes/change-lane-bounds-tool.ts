import {
  applyCssClasses,
  BaseGLSPTool,
  ChangeBoundsOperation,
  ChangeRoutingPointsOperation,
  CompoundOperation,
  CursorCSS,
  cursorFeedbackAction,
  deleteCssClasses,
  DragAwareMouseListener,
  ElementAndRoutingPoints,
  forEachElement,
  GLSP_TYPES,
  isNonRoutableSelectedMovableBoundsAware,
  Operation,
  toElementAndBounds,
  toElementAndRoutingPoints
} from '@eclipse-glsp/client';
import { SelectionListener, SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { isValidSize, WriteablePoint } from '@eclipse-glsp/client/lib/utils/layout-utils';
import { inject, injectable, optional } from 'inversify';
import {
  Action,
  Bounds,
  BoundsAware,
  Dimension,
  EdgeRouterRegistry,
  ElementAndBounds,
  findParentByFeature,
  ISnapper,
  isSelected,
  isViewport,
  MouseListener,
  Point,
  SConnectableElement,
  SetBoundsAction,
  SModelElement,
  SModelRoot,
  SParentElement,
  TYPES
} from 'sprotty';

import {
  HideChangeLaneBoundsToolFeedbackAction,
  ShowChangeLaneBoundsToolFeedbackAction
} from './change-lane-bounds-tool-feedback';
import { isLaneResizable, LaneResizable, LaneResizeHandleLocation, SLaneResizeHandle } from './model';

@injectable()
export class ChangeLaneBoundsTool extends BaseGLSPTool {
  static ID = 'ivy.change-lane-bounds-tool';

  @inject(GLSP_TYPES.SelectionService) protected selectionService: SelectionService;
  @inject(EdgeRouterRegistry) @optional() readonly edgeRouterRegistry?: EdgeRouterRegistry;
  @inject(TYPES.ISnapper) @optional() readonly snapper?: ISnapper;
  protected feedbackMoveMouseListener: MouseListener;
  protected changeBoundsListener: MouseListener & SelectionListener;

  get id(): string {
    return ChangeLaneBoundsTool.ID;
  }

  enable(): void {
    // install change bounds listener for client-side resize updates and server-side updates
    this.changeBoundsListener = this.createChangeBoundsListener();
    this.mouseTool.register(this.changeBoundsListener);
    this.selectionService.register(this.changeBoundsListener);
  }

  protected createChangeBoundsListener(): MouseListener & SelectionListener {
    return new ChangeLaneBoundsListener(this);
  }

  disable(): void {
    this.mouseTool.deregister(this.changeBoundsListener);
    this.selectionService.deregister(this.changeBoundsListener);
    this.mouseTool.deregister(this.feedbackMoveMouseListener);
    this.deregisterFeedback([], this.feedbackMoveMouseListener);
    this.deregisterFeedback([new HideChangeLaneBoundsToolFeedbackAction], this.changeBoundsListener);
  }
}

export class ChangeLaneBoundsListener extends DragAwareMouseListener implements SelectionListener {
  static readonly CSS_CLASS_ACTIVE = 'active';

  // members for calculating the correct position change
  protected initialBounds: Bounds | undefined;
  protected lastDragPosition?: Point;
  protected positionDelta: WriteablePoint = { x: 0, y: 0 };

  // members for resize mode
  protected activeResizeElement?: SModelElement;
  protected activeResizeHandle?: SLaneResizeHandle;

  constructor(protected tool: ChangeLaneBoundsTool) {
    super();
  }

  mouseDown(target: SModelElement, event: MouseEvent): Action[] {
    super.mouseDown(target, event);
    if (event.button !== 0) {
      return [];
    }
    // check if we have a resize handle (only single-selection)
    if (this.activeResizeElement && target instanceof SLaneResizeHandle) {
      this.activeResizeHandle = target;
    } else {
      this.setActiveResizeElement(target);
    }
    if (this.activeResizeElement) {
      this.initPosition(event);
    } else {
      this.reset();
    }
    return [];
  }

  mouseMove(target: SModelElement, event: MouseEvent): Action[] {
    super.mouseMove(target, event);
    if (this.isMouseDrag && this.activeResizeHandle) {
      // rely on the FeedbackMoveMouseListener to update the element bounds of selected elements
      // consider resize handles ourselves
      const actions: Action[] = [cursorFeedbackAction(CursorCSS.RESIZE), applyCssClasses(this.activeResizeHandle, ChangeLaneBoundsListener.CSS_CLASS_ACTIVE)];
      const positionUpdate = this.updatePosition(target, event);
      if (positionUpdate) {
        const resizeActions = this.handleResizeOnClient(positionUpdate);
        actions.push(...resizeActions);
      }
      return actions;
    }
    return [];
  }

  draggingMouseUp(target: SModelElement, event: MouseEvent): Action[] {
    if (this.lastDragPosition === undefined) {
      this.resetPosition();
      return [];
    }
    const actions: Action[] = [];

    if (this.activeResizeHandle) {
      // Resize
      actions.push(...this.handleResize(this.activeResizeHandle));
    } else {
      // Move
      actions.push(...this.handleMoveOnServer(target));
    }
    this.resetPosition();
    return actions;
  }

  protected handleMoveOnServer(target: SModelElement): Action[] {
    const operations: Operation[] = [];

    operations.push(...this.handleMoveElementsOnServer(target));
    operations.push(...this.handleMoveRoutingPointsOnServer(target));
    if (operations.length > 0) {
      return [new CompoundOperation(operations)];
    }
    return operations;
  }

  protected handleMoveElementsOnServer(target: SModelElement): Action[] {
    const result: Operation[] = [];
    const newBounds: ElementAndBounds[] = [];
    forEachElement(target, isNonRoutableSelectedMovableBoundsAware, element => {
      this.createElementAndBounds(element).forEach(bounds => newBounds.push(bounds));
    });
    if (newBounds.length > 0) {
      result.push(new ChangeBoundsOperation(newBounds));
    }
    return result;
  }

  protected handleMoveRoutingPointsOnServer(target: SModelElement): Action[] {
    const result: Operation[] = [];
    const newRoutingPoints: ElementAndRoutingPoints[] = [];
    forEachElement(target, isNonRoutableSelectedMovableBoundsAware, element => {
      //  If client routing is enabled -> delegate routingpoints of connected edges to server
      if (this.tool.edgeRouterRegistry && element instanceof SConnectableElement) {
        element.incomingEdges.map(toElementAndRoutingPoints).forEach(ear => newRoutingPoints.push(ear));
        element.outgoingEdges.map(toElementAndRoutingPoints).forEach(ear => newRoutingPoints.push(ear));
      }
    });
    if (newRoutingPoints.length > 0) {
      result.push(new ChangeRoutingPointsOperation(newRoutingPoints));
    }
    return result;
  }

  protected handleResize(activeResizeHandle: SLaneResizeHandle): Action[] {
    const actions: Action[] = [];
    actions.push(cursorFeedbackAction(CursorCSS.DEFAULT));
    actions.push(deleteCssClasses(activeResizeHandle, ChangeLaneBoundsListener.CSS_CLASS_ACTIVE));
    const resizeElement = findParentByFeature(activeResizeHandle, isLaneResizable);
    if (this.isActiveResizeElement(resizeElement)) {
      this.createChangeBoundsAction(resizeElement).forEach(action => actions.push(action));
    }
    return actions;
  }

  selectionChanged(root: SModelRoot, selectedElements: string[]): void {
    if (this.activeResizeElement) {
      if (selectedElements.includes(this.activeResizeElement.id)) {
        // our active element is still selected, nothing to do
        return;
      }

      // try to find some other selected element and mark that active
      for (const elementId of selectedElements.reverse()) {
        const element = root.index.getById(elementId);
        if (element && this.setActiveResizeElement(element)) {
          return;
        }
      }
      this.reset();
    }
  }

  protected setActiveResizeElement(target: SModelElement): boolean {
    // check if we have a selected, moveable element (multi-selection allowed)
    const moveableElement = findParentByFeature(target, isLaneResizable);
    if (isSelected(moveableElement)) {
      // only allow one element to have the element resize handles
      this.activeResizeElement = moveableElement;
      if (isLaneResizable(this.activeResizeElement)) {
        this.tool.dispatchFeedback([new ShowChangeLaneBoundsToolFeedbackAction(this.activeResizeElement.id)], this);
      }
      return true;
    }
    return false;
  }

  protected isActiveResizeElement(element?: SModelElement): element is SParentElement & BoundsAware {
    return element !== undefined && this.activeResizeElement !== undefined && element.id === this.activeResizeElement.id;
  }

  protected initPosition(event: MouseEvent): void {
    this.lastDragPosition = { x: event.pageX, y: event.pageY };
    if (this.activeResizeHandle) {
      const resizeElement = findParentByFeature(this.activeResizeHandle, isLaneResizable);
      this.initialBounds = { x: resizeElement!.bounds.x, y: resizeElement!.bounds.y, width: resizeElement!.bounds.width, height: resizeElement!.bounds.height };
    }
  }

  protected updatePosition(target: SModelElement, event: MouseEvent): Point | undefined {
    if (this.lastDragPosition) {
      const newDragPosition = { x: event.pageX, y: event.pageY };

      const viewport = findParentByFeature(target, isViewport);
      const zoom = viewport ? viewport.zoom : 1;
      const dx = (event.pageX - this.lastDragPosition.x) / zoom;
      const dy = (event.pageY - this.lastDragPosition.y) / zoom;
      const deltaToLastPosition = { x: dx, y: dy };
      this.lastDragPosition = newDragPosition;

      // update position delta with latest delta
      this.positionDelta.x += deltaToLastPosition.x;
      this.positionDelta.y += deltaToLastPosition.y;

      // snap our delta and only send update if the position actually changes
      // otherwise accumulate delta until we do snap to an update
      const positionUpdate = this.snap(this.positionDelta, target, false/* !event.shiftKey*/);
      if (positionUpdate.x === 0 && positionUpdate.y === 0) {
        return undefined;
      }

      // we update our position so we need to reset our delta
      this.positionDelta.x = 0;
      this.positionDelta.y = 0;
      return positionUpdate;
    }
    return undefined;
  }

  protected reset(): void {
    if (this.activeResizeElement && isLaneResizable(this.activeResizeElement)) {
      this.tool.dispatchFeedback([new HideChangeLaneBoundsToolFeedbackAction()], this);

    }
    this.tool.dispatchActions([cursorFeedbackAction(CursorCSS.DEFAULT)]);
    this.resetPosition();
  }

  protected resetPosition(): void {
    this.activeResizeHandle = undefined;
    this.lastDragPosition = undefined;
    this.positionDelta = { x: 0, y: 0 };
  }

  protected handleResizeOnClient(positionUpdate: Point): Action[] {
    if (!this.activeResizeHandle) {
      return [];
    }

    const resizeElement = findParentByFeature(this.activeResizeHandle, isLaneResizable);
    if (this.isActiveResizeElement(resizeElement)) {
      switch (this.activeResizeHandle.location) {
        case LaneResizeHandleLocation.Top:
          return this.handleLaneOffset(resizeElement, positionUpdate);
        case LaneResizeHandleLocation.Bottom:
          return this.handleLaneWidth(resizeElement, positionUpdate);
      }
    }
    return [];
  }

  protected handleLaneOffset(resizeElement: SParentElement & LaneResizable, positionUpdate: Point): Action[] {
    return this.createSetBoundsAction(resizeElement,
      resizeElement.bounds.x,
      resizeElement.bounds.y + positionUpdate.y,
      resizeElement.bounds.width,
      resizeElement.bounds.height);
  }

  protected handleLaneWidth(resizeElement: SParentElement & LaneResizable, positionUpdate: Point): Action[] {
    return this.createSetBoundsAction(resizeElement,
      resizeElement.bounds.x,
      resizeElement.bounds.y,
      resizeElement.bounds.width,
      resizeElement.bounds.height + positionUpdate.y);
  }

  protected createChangeBoundsAction(element: SModelElement & BoundsAware): Action[] {
    if (this.isValidSize(element, element.bounds)) {
      return [new ChangeBoundsOperation([toElementAndBounds(element)])];
    } else if (this.initialBounds) {
      return [new SetBoundsAction([{ elementId: element.id, newPosition: this.initialBounds, newSize: this.initialBounds }])];
    }
    return [];
  }

  protected createElementAndBounds(element: SModelElement & BoundsAware): ElementAndBounds[] {
    if (this.isValidSize(element, element.bounds)) {
      return [toElementAndBounds(element)];
    }
    return [];
  }

  protected createSetBoundsAction(element: SModelElement & BoundsAware, x: number, y: number, width: number, height: number): Action[] {
    const newPosition = { x, y };
    const newSize = { width, height };
    const result: Action[] = [];

    if (this.isValidSize(element, newSize)) {
      result.push(new SetBoundsAction([{ elementId: element.id, newPosition, newSize }]));
    }

    return result;
  }

  protected snap(position: Point, element: SModelElement, isSnap: boolean): Point {
    return isSnap && this.tool.snapper
      ? this.tool.snapper.snap(position, element)
      : { x: position.x, y: position.y };
  }

  protected isValidSize(element: SModelElement & BoundsAware, size: Dimension): boolean {
    return isValidSize(element, size);
  }
}
