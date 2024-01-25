import { OpenQuickOutlineAction } from '@axonivy/process-editor-protocol';
import { Action, KeyListener, GModelElement } from '@eclipse-glsp/client';

export class OpenQuickOutlineKeyListener extends KeyListener {
  keyDown(element: GModelElement, event: KeyboardEvent): Action[] {
    if (event.ctrlKey && event.key === 'o') {
      return [OpenQuickOutlineAction.create()];
    }
    return [];
  }
}
