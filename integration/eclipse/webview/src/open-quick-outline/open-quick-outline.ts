import { Action, KeyListener, SModelElement } from 'sprotty';

export class OpenQuickOutlineAction implements Action {
  static readonly KIND = 'openQuickOutline';
  constructor(public readonly kind: string = OpenQuickOutlineAction.KIND) {}
}

export class OpenQuickOutlineKeyListener extends KeyListener {
  keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
    if (event.ctrlKey && event.key === 'o') {
      return [new OpenQuickOutlineAction()];
    }
    return [];
  }
}
