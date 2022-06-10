import { KeyListener, Action, SModelElement } from 'sprotty';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { InvokeCopyAction, InvokeCutAction, InvokePasteAction } from '@eclipse-glsp/client/lib/features/copy-paste/copy-paste-context-menu';

export class CopyPasteKeyListener extends KeyListener {
  keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
    if (matchesKeystroke(event, 'KeyC', 'ctrlCmd')) {
      return [new InvokeCopyAction()];
    }
    if (matchesKeystroke(event, 'KeyV', 'ctrlCmd')) {
      return [new InvokePasteAction()];
    }
    if (matchesKeystroke(event, 'KeyX', 'ctrlCmd')) {
      return [new InvokeCutAction()];
    }
    return [];
  }
}
