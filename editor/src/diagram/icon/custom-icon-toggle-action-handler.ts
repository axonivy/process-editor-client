import { Action, hasBooleanProp, IActionHandler, SModelRootSchema, UpdateModelAction } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import * as sprotty from 'sprotty-protocol/lib/actions';

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

export interface ReloadModelAction extends Action, Omit<sprotty.UpdateModelAction, 'matches' | 'cause'> {
  kind: typeof UpdateModelAction.KIND;
  newRoot?: SModelRootSchema;
  animate?: boolean;
}

export namespace ReloadModelAction {
  export function create(newRoot?: SModelRootSchema, options: { animate?: boolean } = {}): ReloadModelAction {
    return {
      kind: UpdateModelAction.KIND,
      newRoot: newRoot,
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
