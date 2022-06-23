import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { InvokeCopyPasteAction } from '@eclipse-glsp/client/lib/features/copy-paste/copy-paste-context-menu';
import { Action, KeyListener, SModelElement } from '@eclipse-glsp/client';

export class CopyPasteKeyListener extends KeyListener {
  keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
    if (matchesKeystroke(event, 'KeyC', 'ctrlCmd')) {
      return [InvokeCopyPasteAction.create('copy')];
    }
    if (matchesKeystroke(event, 'KeyV', 'ctrlCmd')) {
      return [InvokeCopyPasteAction.create('paste')];
    }
    if (matchesKeystroke(event, 'KeyX', 'ctrlCmd')) {
      return [InvokeCopyPasteAction.create('cut')];
    }
    return [];
  }
}
