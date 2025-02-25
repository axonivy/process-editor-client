import {
  Action,
  type BoundsAware,
  boundsFeature,
  ChangeBoundsOperation,
  type ElementAndBounds,
  findParentByFeature,
  GChildElement,
  getElements,
  GModelElement,
  type Grid,
  type IMovementRestrictor,
  isBoundsAware,
  isViewport,
  matchesKeystroke,
  MoveKeyListener,
  MovementKeyTool,
  Point,
  SetUIExtensionVisibilityAction,
  SetViewportAction,
  toElementAndBounds,
  TYPES,
  type Viewport
} from '@eclipse-glsp/client';
import { inject, injectable, optional } from 'inversify';
import { QuickActionUI } from '../../ui-tools/quick-action/quick-action-ui';

@injectable()
export class IvyMovementKeyTool extends MovementKeyTool {
  @inject(TYPES.IMovementRestrictor) @optional() readonly movementRestrictor: IMovementRestrictor;

  enable(): void {
    if (!this.movementKeyListener) {
      this.movementKeyListener = new IvyMoveKeyListener(this, this.grid);
    }
    this.keytool.register(this.movementKeyListener);
    this.movementKeyListener.registerShortcutKey();
  }
}

@injectable()
class IvyMoveKeyListener extends MoveKeyListener {
  constructor(
    protected readonly tool: IvyMovementKeyTool,
    protected grid: Grid = { x: MoveKeyListener.defaultMoveX, y: MoveKeyListener.defaultMoveY }
  ) {
    super(tool, grid);
  }

  keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
    const delta = this.moveDelta(event);
    if (delta === undefined) {
      return [];
    }
    if (this.tool.selectionService.hasSelectedElements()) {
      return this.moveElements(delta);
    }
    return this.moveGraph(element, delta);
  }

  protected moveDelta(event: KeyboardEvent) {
    if (matchesKeystroke(event, 'ArrowUp')) {
      return { x: 0, y: -this.grid.y };
    }
    if (matchesKeystroke(event, 'ArrowDown')) {
      return { x: 0, y: this.grid.y };
    }
    if (matchesKeystroke(event, 'ArrowLeft')) {
      return { x: -this.grid.x, y: 0 };
    }
    if (matchesKeystroke(event, 'ArrowRight')) {
      return { x: this.grid.x, y: 0 };
    }
    return undefined;
  }

  protected moveGraph(element: GModelElement, delta: Point) {
    const model = findParentByFeature(element, isViewport);
    if (model === undefined) {
      return [];
    }
    const newViewport: Viewport = {
      scroll: {
        x: model.scroll.x + delta.x,
        y: model.scroll.y + delta.y
      },
      zoom: model.zoom
    };
    return [SetViewportAction.create(model.id, newViewport, { animate: false })];
  }

  protected moveElements(delta: Point): Action[] {
    let selectedElements = getElements(
      this.tool.selectionService.getModelRoot().index,
      Array.from(this.tool.selectionService.getSelectedElementIDs()),
      isBoundsAware
    );
    selectedElements = selectedElements.filter(e => !this.isChildOfSelected(selectedElements, e)).filter(e => e.hasFeature(boundsFeature));
    if (selectedElements.length === 0) {
      return [];
    }

    const newBounds = selectedElements.filter(e => this.isMovementAllowed(e, delta)).map(e => this.getElementAndUpdatedBound(e, delta));
    if (newBounds.length !== selectedElements.length) {
      return [];
    }
    return [
      ChangeBoundsOperation.create(newBounds),
      SetUIExtensionVisibilityAction.create({
        extensionId: QuickActionUI.ID,
        visible: true,
        contextElementsId: [...selectedElements.map(e => e.id)]
      })
    ];
  }

  protected isChildOfSelected(selectedElements: GModelElement[], element: GModelElement): boolean {
    return element instanceof GChildElement && selectedElements.includes(element.parent);
  }

  protected isMovementAllowed(element: GModelElement & BoundsAware, delta: Point): boolean {
    if (this.tool.movementRestrictor) {
      const newPosition = this.updatePosition(element, delta);
      return this.tool.movementRestrictor.validate(element, newPosition);
    }
    return true;
  }

  protected getElementAndUpdatedBound(element: GModelElement & BoundsAware, delta: Point): ElementAndBounds {
    const bound = toElementAndBounds(element);
    bound.newPosition = this.updatePosition(element, delta);
    return bound;
  }

  protected updatePosition(element: GModelElement & BoundsAware, delta: Point): Point {
    return {
      x: element.bounds.x + delta.x,
      y: element.bounds.y + delta.y
    };
  }
}
