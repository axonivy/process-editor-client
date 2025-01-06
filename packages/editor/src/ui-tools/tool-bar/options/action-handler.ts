import { CustomIconToggleAction, ReloadModelAction } from '@axonivy/process-editor-protocol';
import { Action, IActionHandler } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class CustomIconToggleActionHandler implements IActionHandler {
  private showCustomIcons = true;

  handle(action: Action) {
    if (CustomIconToggleAction.is(action)) {
      this.showCustomIcons = action.showCustomIcons;
      return ReloadModelAction.create();
    }
    return;
  }

  get isShowCustomIcons(): boolean {
    return this.showCustomIcons;
  }

  set setShowCustomIcons(show: boolean) {
    this.showCustomIcons = show;
  }
}
