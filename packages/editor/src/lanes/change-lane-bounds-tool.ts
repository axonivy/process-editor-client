import {
  Action,
  applyCssClasses,
  Disposable,
  DisposableCollection,
  Bounds,
  BoundsAware,
  Dimension,
  ChangeBoundsOperation,
  CompoundOperation,
  CursorCSS,
  cursorFeedbackAction,
  deleteCssClasses,
  DragAwareMouseListener,
  ElementAndBounds,
  findParentByFeature,
  forEachElement,
  ISnapper,
  isSelected,
  isViewport,
  MouseListener,
  Operation,
  Point,
  toElementAndBounds,
  GModelElement,
  GModelRoot,
  GParentElement,
  TYPES,
  SetUIExtensionVisibilityAction,
  SelectionService,
  isValidSize,
  BaseEditTool,
  ISelectionListener
} from '@eclipse-glsp/client';
import { SetBoundsAction, Writable } from '@eclipse-glsp/protocol';
import { inject, injectable, optional } from 'inversify';

import { HideChangeLaneBoundsToolFeedbackAction, ShowChangeLaneBoundsToolFeedbackAction } from './change-lane-bounds-tool-feedback';
import { isLaneResizable, isSelectedLane, LaneResizable, LaneResizeHandleLocation, SLaneResizeHandle } from './model';
import { addNegativeArea, removeNegativeArea } from '../tools/negative-area/model';
import { QuickActionUI } from '../ui-tools/quick-action/quick-action-ui';

@injectable()
export class ChangeLaneBoundsTool extends BaseEditTool {
  static ID = 'ivy.change-lane-bounds-tool';

  @inject(SelectionService) protected selectionService: SelectionService;
  @inject(TYPES.ISnapper) @optional() readonly snapper?: ISnapper;
  protected changeBoundsListener: MouseListener & ISelectionListener & Disposable;

  get id(): string {
    return ChangeLaneBoundsTool.ID;
  }

  enable(): void {
    // install change bounds listener for client-side resize updates and server-side updates
    this.changeBoundsListener = this.createChangeBoundsListener();
    this.toDisposeOnDisable.push(this.changeBoundsListener);
    this.toDisposeOnDisable.push(this.mouseTool.registerListener(this.changeBoundsListener));
    this.toDisposeOnDisable.push(
      this.selectionService.onSelectionChanged(selection =>
        this.changeBoundsListener.selectionChanged(selection.root, selection.selectedElements, selection.deselectedElements)
      )
    );
  }

  protected createChangeBoundsListener(): MouseListener & ISelectionListener & Disposable {
    return new ChangeLaneBoundsListener(this);
  }
}

export class ChangeLaneBoundsListener extends DragAwareMouseListener implements ISelectionListener, Disposable {
  static readonly CSS_CLASS_ACTIVE = 'active';

  // members for calculating the correct position change
  protected initialBounds: Bounds | undefined;
  protected lastDragPosition?: Point;
  protected positionDelta: Writable<Point> = { x: 0, y: 0 };

  // members for resize mode
  protected activeResizeElement?: GModelElement;
  protected activeResizeHandle?: SLaneResizeHandle;

  protected feedback = new DisposableCollection();

  constructor(protected tool: ChangeLaneBoundsTool) {
    super();
  }

  mouseDown(target: GModelElement, event: MouseEvent): Action[] {
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

  mouseMove(target: GModelElement, event: MouseEvent): Action[] {
    super.mouseMove(target, event);
    if (this.isMouseDrag && this.activeResizeHandle) {
      // rely on the FeedbackMoveMouseListener to update the element bounds of selected elements
      // consider resize handles ourselves
      const actions: Action[] = [
        cursorFeedbackAction(CursorCSS.DEFAULT),
        applyCssClasses(this.activeResizeHandle, ChangeLaneBoundsListener.CSS_CLASS_ACTIVE)
      ];
      const positionUpdate = this.updatePosition(target, event);
      if (positionUpdate) {
        const resizeActions = this.handleResizeOnClient(positionUpdate);
        actions.push(...resizeActions);
      }
      addNegativeArea(target);
      actions.push(
        SetUIExtensionVisibilityAction.create({
          extensionId: QuickActionUI.ID,
          visible: false
        })
      );
      return actions;
    }
    return [];
  }

  draggingMouseUp(target: GModelElement, event: MouseEvent): Action[] {
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
    removeNegativeArea(target);
    return actions;
  }

  protected handleMoveOnServer(target: GModelElement): Action[] {
    const operations = this.handleMoveElementsOnServer(target);
    if (operations.length > 0) {
      return [CompoundOperation.create(operations)];
    }
    return operations;
  }

  protected handleMoveElementsOnServer(target: GModelElement): Operation[] {
    const result: Operation[] = [];
    const newBounds: ElementAndBounds[] = [];
    forEachElement(target.index, isSelectedLane, element => {
      this.createElementAndBounds(element).forEach(bounds => newBounds.push(bounds));
    });
    if (newBounds.length > 0) {
      result.push(ChangeBoundsOperation.create(newBounds));
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

  selectionChanged(root: GModelRoot, selectedElements: string[]): void {
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

  protected setActiveResizeElement(target: GModelElement): boolean {
    // check if we have a selected, moveable element (multi-selection allowed)
    const moveableElement = findParentByFeature(target, isLaneResizable);
    if (isSelected(moveableElement)) {
      // only allow one element to have the element resize handles
      this.activeResizeElement = moveableElement;
      if (isLaneResizable(this.activeResizeElement)) {
        this.feedback.push(
          this.tool.registerFeedback([ShowChangeLaneBoundsToolFeedbackAction.create(this.activeResizeElement.id)], this, [
            HideChangeLaneBoundsToolFeedbackAction.create()
          ])
        );
      }
      return true;
    }
    return false;
  }

  protected isActiveResizeElement(element?: GModelElement): element is GParentElement & BoundsAware {
    return element !== undefined && this.activeResizeElement !== undefined && element.id === this.activeResizeElement.id;
  }

  protected initPosition(event: MouseEvent): void {
    this.lastDragPosition = { x: event.pageX, y: event.pageY };
    if (this.activeResizeHandle) {
      const resizeElement = findParentByFeature(this.activeResizeHandle, isLaneResizable);
      this.initialBounds = {
        x: resizeElement!.bounds.x,
        y: resizeElement!.bounds.y,
        width: resizeElement!.bounds.width,
        height: resizeElement!.bounds.height
      };
    }
  }

  protected updatePosition(target: GModelElement, event: MouseEvent): Point | undefined {
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
      const positionUpdate = this.snap(this.positionDelta, target, !event.altKey);
      if (positionUpdate.x === 0 && positionUpdate.y === 0) {
        return undefined;
      }

      // we update our position so we update our delta by the snapped position
      this.positionDelta.x -= positionUpdate.x;
      this.positionDelta.y -= positionUpdate.y;
      return positionUpdate;
    }
    return undefined;
  }

  protected reset(): void {
    if (this.activeResizeElement && isLaneResizable(this.activeResizeElement)) {
      this.feedback.dispose();
    }
    this.tool.dispatchActions([cursorFeedbackAction(CursorCSS.DEFAULT)]);
    this.resetPosition();
  }

  protected resetPosition(): void {
    this.activeResizeHandle = undefined;
    this.lastDragPosition = undefined;
    this.positionDelta = { x: 0, y: 0 };
  }

  dispose(): void {
    this.feedback.dispose();
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

  protected handleLaneOffset(resizeElement: GParentElement & LaneResizable, positionUpdate: Point): Action[] {
    return this.createSetBoundsAction(
      resizeElement,
      resizeElement.bounds.x,
      resizeElement.bounds.y + positionUpdate.y,
      resizeElement.bounds.width,
      resizeElement.bounds.height
    );
  }

  protected handleLaneWidth(resizeElement: GParentElement & LaneResizable, positionUpdate: Point): Action[] {
    return this.createSetBoundsAction(
      resizeElement,
      resizeElement.bounds.x,
      resizeElement.bounds.y,
      resizeElement.bounds.width,
      resizeElement.bounds.height + positionUpdate.y
    );
  }

  protected createChangeBoundsAction(element: GModelElement & BoundsAware): Action[] {
    if (this.isValidSize(element, element.bounds)) {
      return [ChangeBoundsOperation.create([toElementAndBounds(element)])];
    } else if (this.initialBounds) {
      return [SetBoundsAction.create([{ elementId: element.id, newPosition: this.initialBounds, newSize: this.initialBounds }])];
    }
    return [];
  }

  protected createElementAndBounds(element: GModelElement & BoundsAware): ElementAndBounds[] {
    if (this.isValidSize(element, element.bounds)) {
      return [toElementAndBounds(element)];
    }
    return [];
  }

  protected createSetBoundsAction(element: GModelElement & BoundsAware, x: number, y: number, width: number, height: number): Action[] {
    const newPosition = { x, y };
    const newSize = { width, height };
    const result: Action[] = [];

    if (this.isValidSize(element, newSize)) {
      result.push(SetBoundsAction.create([{ elementId: element.id, newPosition, newSize }]));
    }

    return result;
  }

  protected snap(position: Point, element: GModelElement, isSnap: boolean): Point {
    return isSnap && this.tool.snapper ? this.tool.snapper.snap(position, element) : { x: position.x, y: position.y };
  }

  protected isValidSize(element: GModelElement & BoundsAware, size: Dimension): boolean {
    return isValidSize(element, size);
  }
}
