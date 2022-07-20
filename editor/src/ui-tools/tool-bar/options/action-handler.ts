import { Action, IActionHandler } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { CustomIconToggleAction, ReloadModelAction } from './action';

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
