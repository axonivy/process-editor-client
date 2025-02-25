import { Action, FocusDomAction, type IActionHandler } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class FocusDomActionHandler implements IActionHandler {
  handle(action: Action) {
    if (!FocusDomAction.is(action)) {
      return;
    }
    this.focusBySelector(action.id);
  }

  private focusBySelector(selector: string) {
    document.querySelector<HTMLElement>(selector)?.focus();
  }
}
