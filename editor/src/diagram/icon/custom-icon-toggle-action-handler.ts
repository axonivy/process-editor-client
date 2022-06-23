import { Action, EMPTY_ROOT, hasBooleanProp, IActionHandler, UpdateModelAction } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

export interface CustomIconToggleAction extends Action {
  kind: typeof CustomIconToggleAction.KIND;
  showCustomIcons: boolean;
}

export namespace CustomIconToggleAction {
  export const KIND = 'toggleCustomIcons';

  export function is(object: any): object is CustomIconToggleAction {
    return Action.hasKind(object, KIND) && hasBooleanProp(object, 'showCustomIcons');
  }

  export function create(options: { showCustomIcons: boolean }): CustomIconToggleAction {
    return {
      kind: KIND,
      ...options
    };
  }
}

@injectable()
export class CustomIconToggleActionHandler implements IActionHandler {
  private showCustomIcons = true;

  handle(action: Action): Action | void {
    if (CustomIconToggleAction.is(action)) {
      this.showCustomIcons = action.showCustomIcons;
      return UpdateModelAction.create({ type: EMPTY_ROOT.type, id: EMPTY_ROOT.id });
    }
  }

  get isShowCustomIcons(): boolean {
    return this.showCustomIcons;
  }

  set setShowCustomIcons(show: boolean) {
    this.showCustomIcons = show;
  }
}
