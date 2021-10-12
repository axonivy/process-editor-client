import { Action, IActionHandler, UpdateModelAction } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

export class CustomIconToggleAction implements Action {
  static readonly KIND = 'toggleCustomIcons';

  constructor(public readonly showCustomIcons: boolean,
    public readonly kind: string = CustomIconToggleAction.KIND) { }
}

@injectable()
export class CustomIconToggleActionHandler implements IActionHandler {

  private showCustomIcons = true;

  handle(action: Action): Action | void {
    if (isCustomIconToggleAction(action)) {
      this.showCustomIcons = action.showCustomIcons;
      return new UpdateModelAction([]);
    }
  }

  get isShowCustomIcons(): boolean {
    return this.showCustomIcons;
  }

  set setShowCustomIcons(show: boolean) {
    this.showCustomIcons = show;
  }
}

export function isCustomIconToggleAction(action: Action): action is CustomIconToggleAction {
  return action !== undefined && (action.kind === CustomIconToggleAction.KIND)
    && (action as CustomIconToggleAction).showCustomIcons !== undefined;
}
