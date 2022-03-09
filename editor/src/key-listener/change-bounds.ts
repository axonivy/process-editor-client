import { SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { KeyListener, Action, SModelElement, BoundsAware } from 'sprotty';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { inject } from 'inversify';
import { GLSP_TYPES, isNonRoutableSelectedMovableBoundsAware, toElementAndBounds } from '@eclipse-glsp/client';
import { ChangeBoundsOperation, ElementAndBounds } from '@eclipse-glsp/protocol';
import { IvyGridSnapper } from '../diagram/snap';

export class ChangeBoundsKeyListener extends KeyListener {
  @inject(GLSP_TYPES.SelectionService) protected selectionService: SelectionService;
  snapper = new IvyGridSnapper();

  keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
    const selectedElements = this.selectionService.getSelectedElements().filter(isNonRoutableSelectedMovableBoundsAware);
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
    const newBounds = selectedElements.map(e => this.getElmentAndUpdatedBound(e, deltaX, deltaY));
    return [new ChangeBoundsOperation(newBounds)];
  }

  protected getElmentAndUpdatedBound(element: SModelElement & BoundsAware, deltaX: number, deltaY: number): ElementAndBounds {
    const newBound = toElementAndBounds(element);
    let newPosition = {
      x: element.bounds.x + deltaX,
      y: element.bounds.y + deltaY
    };
    newPosition = this.snapper.snap(newPosition, element);
    newBound.newPosition = newPosition;
    return newBound;
  }
}
