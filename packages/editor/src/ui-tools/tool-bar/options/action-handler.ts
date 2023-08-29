import { CustomIconToggleAction, ReloadModelAction } from '@axonivy/process-editor-protocol';
import { Action, IActionHandler } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class CustomIconToggleActionHandler implements IActionHandler {
  private showCustomIcons = true;

  handle(action: Action): Action | void {
    if (CustomIconToggleAction.is(action)) {
      this.showCustomIcons = action.showCustomIcons;
      return ReloadModelAction.create();
    }
  }

  get isShowCustomIcons(): boolean {
    return this.showCustomIcons;
  }

  set setShowCustomIcons(show: boolean) {
    this.showCustomIcons = show;
  }
}
