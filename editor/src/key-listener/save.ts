import { KeyListener, Action, SModelElement } from 'sprotty';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { SaveModelAction } from '@eclipse-glsp/client';

export class SaveKeyListener extends KeyListener {
  keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
    if (matchesKeystroke(event, 'KeyS', 'ctrlCmd')) {
      return [new SaveModelAction()];
    }
    return [];
  }
}
