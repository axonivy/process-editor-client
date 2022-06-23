import { inject, injectable } from 'inversify';
import {
  Action,
  IActionDispatcher,
  IActionHandler,
  isOpenable,
  isSelectable,
  KeyListener,
  SModelElement,
  TYPES
} from '@eclipse-glsp/client';
import { OpenAction } from 'sprotty-protocol';
import { toArray } from 'sprotty/lib/utils/iterable';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';

export function isInvokeOpenAction(action: Action): action is OpenAction {
  return action.kind === OpenAction.KIND;
}

@injectable()
export class OpenInscriptionActionHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
  handle(action: Action): void {
    if (isInvokeOpenAction(action)) {
      this.handleOpen(action.elementId);
    }
  }

  handleOpen(elementId: string): void {
    this.actionDispatcher.dispatch(OpenInscriptionAction.create(elementId));
  }
}

export interface OpenInscriptionAction extends Action {
  kind: typeof OpenInscriptionAction.KIND;
  elementId: string;
}

export namespace OpenInscriptionAction {
  export const KIND = 'openInscription';

  export function create(elementId: string): OpenInscriptionAction {
    return {
      kind: KIND,
      elementId
    };
  }
}

export class OpenInscriptionKeyListener extends KeyListener {
  keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
    if (matchesKeystroke(event, 'Enter')) {
      const openableElements = this.getOpenableElements(element);
      if (openableElements.length === 1) {
        return [OpenInscriptionAction.create(openableElements[0].id)];
      }
    }
    if (matchesKeystroke(event, 'KeyI') && this.getOpenableElements(element).length === 0) {
      return [OpenInscriptionAction.create('')];
    }
    return [];
  }

  private getOpenableElements(element: SModelElement): SModelElement[] {
    return toArray(
      element.index
        .all()
        .filter(e => isSelectable(e) && e.selected)
        .filter(e => isOpenable(e))
    );
  }
}
