import { Action, KeyListener, SModelElement } from '@eclipse-glsp/client';

export interface OpenQuickOutlineAction extends Action {
  kind: typeof OpenQuickOutlineAction.KIND;
}

export namespace OpenQuickOutlineAction {
  export const KIND = 'openQuickOutline';

  export function create(): OpenQuickOutlineAction {
    return {
      kind: KIND
    };
  }
}

export class OpenQuickOutlineKeyListener extends KeyListener {
  keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
    if (event.ctrlKey && event.key === 'o') {
      return [OpenQuickOutlineAction.create()];
    }
    return [];
  }
}
