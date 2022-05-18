import { SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { KeyListener, Action, SModelElement, BoundsAware, SChildElement, isBoundsAware } from 'sprotty';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { inject, optional } from 'inversify';
import {
  boundsFeature,
  getElements,
  GLSP_TYPES,
  IMovementRestrictor,
  SetUIExtensionVisibilityAction,
  toElementAndBounds
} from '@eclipse-glsp/client';
import { ChangeBoundsOperation, ElementAndBounds, Point } from '@eclipse-glsp/protocol';
import { QuickActionUI } from '../quick-action/quick-action-ui';
import { IvyGridSnapper } from '../diagram/snap';

export class MoveElementKeyListener extends KeyListener {
  @inject(GLSP_TYPES.SelectionService) protected selectionService: SelectionService;
  @inject(GLSP_TYPES.IMovementRestrictor) @optional() readonly movementRestrictor: IMovementRestrictor;

  keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
    if (this.selectionService.hasSelectedElements()) {
      if (matchesKeystroke(event, 'ArrowUp')) {
        return this.moveElements({ x: 0, y: -IvyGridSnapper.GRID_Y });
      }
      if (matchesKeystroke(event, 'ArrowDown')) {
        return this.moveElements({ x: 0, y: IvyGridSnapper.GRID_Y });
      }
      if (matchesKeystroke(event, 'ArrowLeft')) {
        return this.moveElements({ x: -IvyGridSnapper.GRID_X, y: 0 });
      }
      if (matchesKeystroke(event, 'ArrowRight')) {
        return this.moveElements({ x: IvyGridSnapper.GRID_X, y: 0 });
      }
    }
    return [];
  }

  protected moveElements(delta: Point): Action[] {
    let selectedElements = getElements(
      this.selectionService.getModelRoot().index,
      Array.from(this.selectionService.getSelectedElementIDs()),
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
      new ChangeBoundsOperation(newBounds),
      new SetUIExtensionVisibilityAction(QuickActionUI.ID, true, [...selectedElements.map(e => e.id)])
    ];
  }

  protected isChildOfSelected(selectedElements: SModelElement[], element: SModelElement): boolean {
    return element instanceof SChildElement && selectedElements.includes(element.parent);
  }

  protected isMovementAllowed(element: SModelElement & BoundsAware, delta: Point): boolean {
    if (this.movementRestrictor) {
      const newPosition = this.updatePosition(element, delta);
      return this.movementRestrictor.validate(newPosition, element);
    }
    return true;
  }

  protected getElementAndUpdatedBound(element: SModelElement & BoundsAware, delta: Point): ElementAndBounds {
    const bound = toElementAndBounds(element);
    bound.newPosition = this.updatePosition(element, delta);
    return bound;
  }

  protected updatePosition(element: SModelElement & BoundsAware, delta: Point): Point {
    return {
      x: element.bounds.x + delta.x,
      y: element.bounds.y + delta.y
    };
  }
}
