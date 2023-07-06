import { Action, KeyListener, SModelElement } from '@eclipse-glsp/client';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';

export interface OpenDataClassAction extends Action {
  kind: typeof OpenDataClassAction.KIND;
}

export namespace OpenDataClassAction {
  export const KIND = 'openDataClassEditor';

  export function create(): OpenDataClassAction {
    return {
      kind: KIND
    };
  }
}

export class OpenQuickOutlineKeyListener extends KeyListener {
  keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
    if (matchesKeystroke(event, 'KeyC')) {
      return [OpenDataClassAction.create()];
    }
    return [];
  }
}
