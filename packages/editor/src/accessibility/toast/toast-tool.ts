import { HideToastAction, ShowToastMessageAction, type Action, type IActionHandler } from '@eclipse-glsp/client';
import Toastify from 'toastify-js';
import { injectable } from 'inversify';

@injectable()
export class IvyToast implements IActionHandler {
  private messageToast?: ReturnType<typeof Toastify>;

  handle(action: Action) {
    if (ShowToastMessageAction.is(action)) {
      this.messageToast?.hideToast();
      this.messageToast = this.createToast(action.options.message, action.options.timeout);
      this.messageToast.showToast();
    } else if (HideToastAction.is(action)) {
      this.messageToast?.hideToast();
    }
  }

  private createToast(text: string, duration?: number) {
    return Toastify({
      text,
      close: true,
      gravity: 'bottom',
      position: 'left',
      className: `severity-INFO`,
      duration
    });
  }
}
