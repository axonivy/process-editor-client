import { inject, injectable } from 'inversify';
import {
  Action,
  IActionDispatcher,
  IActionHandler,
  isOpenable,
  isSelectable,
  KeyListener,
  OpenAction,
  SModelElement,
  TYPES
} from 'sprotty';
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
    this.actionDispatcher.dispatch(new OpenInscriptionAction(elementId));
  }
}

export class OpenInscriptionAction implements Action {
  static readonly KIND = 'openInscription';
  constructor(readonly elementId: string, public readonly kind: string = OpenInscriptionAction.KIND) {}
}

export class OpenInscriptionKeyListener extends KeyListener {
  keyDown(element: SModelElement, event: KeyboardEvent): Action[] {
    if (matchesKeystroke(event, 'Enter')) {
      const openableElements = this.getOpenableElements(element);
      if (openableElements.length === 1) {
        return [new OpenInscriptionAction(openableElements[0].id)];
      }
    }
    if (matchesKeystroke(event, 'KeyI') && this.getOpenableElements(element).length === 0) {
      return [new OpenInscriptionAction('')];
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
