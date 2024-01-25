import {
  Action,
  EndProgressAction,
  IActionHandler,
  ICommand,
  MessageAction,
  StartProgressAction,
  UpdateProgressAction
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import Toastify from 'toastify-js';

@injectable()
export class ToastNotificationService implements IActionHandler {
  private duration = 2000;
  private messageToast?: any;
  private progressMessages = new Map<string, string>();

  handle(action: Action): void | Action | ICommand {
    if (MessageAction.is(action)) {
      return this.updateToast(action.message, action.severity);
    }
    if (StartProgressAction.is(action)) {
      return this.updateToast(this.progress(action), 'INFO');
    }
    if (UpdateProgressAction.is(action)) {
      return this.updateToast(this.progress(action), 'INFO');
    }
    if (EndProgressAction.is(action)) {
      return this.updateToast(this.progress(action), 'INFO');
    }
  }

  protected progress(action: StartProgressAction | UpdateProgressAction | EndProgressAction): string {
    if (StartProgressAction.is(action)) {
      this.progressMessages.set(action.progressId, action.title);
    }
    let message = this.progressMessages.get(action.progressId) ?? '';
    if (action.message) {
      message += message.length > 0 ? `${message}: ${action.message}` : action.message;
    }
    const percentage = EndProgressAction.is(action) ? undefined : action.percentage;
    if (percentage) {
      message += message.length > 0 ? `${message} (${percentage}%)` : `${percentage}%`;
    }
    if (EndProgressAction.is(action)) {
      this.progressMessages.delete(action.progressId);
    }
    return message;
  }

  protected message(action: MessageAction): void {
    this.messageToast?.hideToast();
    if (action.severity !== 'NONE') {
      this.messageToast = this.createToast(action.message, action.severity, action.severity === 'ERROR' ? undefined : this.duration);
      this.messageToast.showToast();
    }
  }

  protected updateToast(text: string, severity: string, duration?: number): void {
    this.messageToast?.hideToast();
    if (severity !== 'NONE') {
      this.messageToast = this.createToast(text, severity, duration);
      this.messageToast.showToast();
    }
  }

  protected createToast(text: string, severity: string, duration?: number): any {
    return Toastify({
      text,
      close: true,
      gravity: 'bottom',
      position: 'left',
      className: `severity-${severity}`,
      duration: severity === 'ERROR' ? undefined : this.duration
    });
  }
}
