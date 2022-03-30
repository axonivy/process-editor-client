import { Action, KeyListener, SModelElement } from 'sprotty';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';

export class OpenDataClassAction implements Action {
  static readonly KIND = 'openDataClassEditor';
  constructor(public readonly kind: string = OpenDataClassAction.KIND) {}
}

export class OpenQuickOutlineKeyListener extends KeyListener {
  keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
    if (matchesKeystroke(event, 'KeyC')) {
      return [new OpenDataClassAction()];
    }
    return [];
  }
}
