import { SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { KeyListener, Action, SModelElement, BoundsAware, SChildElement } from 'sprotty';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { inject } from 'inversify';
import {
  GLSP_TYPES,
  isNonRoutableSelectedMovableBoundsAware,
  SetUIExtensionVisibilityAction,
  toElementAndBounds
} from '@eclipse-glsp/client';
import { ChangeBoundsOperation, ElementAndBounds } from '@eclipse-glsp/protocol';
import { IvyGridSnapper } from '../diagram/snap';
import { QuickActionUI } from '../quick-action/quick-action-ui';

export class MoveElementKeyListener extends KeyListener {
  @inject(GLSP_TYPES.SelectionService) protected selectionService: SelectionService;
  snapper = new IvyGridSnapper();

  keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
    let selectedElements = this.selectionService.getSelectedElements().filter(isNonRoutableSelectedMovableBoundsAware);
    selectedElements = selectedElements.filter(e => !this.isChildOfSelected(selectedElements, e));
    let deltaX = 0;
    let deltaY = 0;
    if (selectedElements.length === 0) {
      return [];
    } else if (matchesKeystroke(event, 'ArrowUp')) {
      deltaY = -this.snapper.gridY;
    } else if (matchesKeystroke(event, 'ArrowDown')) {
      deltaY = this.snapper.gridY;
    } else if (matchesKeystroke(event, 'ArrowLeft')) {
      deltaX = -this.snapper.gridX;
    } else if (matchesKeystroke(event, 'ArrowRight')) {
      deltaX = this.snapper.gridX;
    } else {
      return [];
    }
    const newBounds = selectedElements.map(e => this.getElementAndUpdatedBound(e, deltaX, deltaY));
    return [
      new ChangeBoundsOperation(newBounds),
      new SetUIExtensionVisibilityAction(QuickActionUI.ID, true, [...selectedElements.map(e => e.id)])
    ];
  }

  protected isChildOfSelected(selectedElements: SModelElement[], element: SModelElement): boolean {
    return element instanceof SChildElement && selectedElements.includes(element.parent);
  }

  protected getElementAndUpdatedBound(element: SModelElement & BoundsAware, deltaX: number, deltaY: number): ElementAndBounds {
    const bound = toElementAndBounds(element);
    let newPosition = {
      x: element.bounds.x + deltaX,
      y: element.bounds.y + deltaY
    };
    newPosition = this.snapper.snap(newPosition, element);
    bound.newPosition = newPosition;
    return bound;
  }
}
