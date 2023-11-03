import { OpenAction } from 'sprotty-protocol';
import {
  findParentByFeature,
  isOpenable,
  isSelectable,
  KeyListener,
  matchesKeystroke,
  MouseListener,
  SModelElement,
  toArray
} from '@eclipse-glsp/client';

export class OpenInscriptionMouseListener extends MouseListener {
  doubleClick(target: SModelElement, event: MouseEvent) {
    const element = findParentByFeature(target, isOpenable);
    if (element) {
      return [OpenAction.create(element.id)];
    }
    return [];
  }
}

export class OpenInscriptionKeyListener extends KeyListener {
  keyDown(element: SModelElement, event: KeyboardEvent) {
    if (matchesKeystroke(event, 'Enter')) {
      const openableElements = this.getOpenableElements(element);
      if (openableElements.length === 1) {
        return [OpenAction.create(openableElements[0].id)];
      }
    }
    return [];
  }

  private getOpenableElements(element: SModelElement) {
    return toArray(
      element.index
        .all()
        .filter(e => isSelectable(e) && e.selected)
        .filter(e => isOpenable(e))
    );
  }
}
