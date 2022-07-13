import { Action, hasBooleanProp, SModelRootSchema, UpdateModelAction } from '@eclipse-glsp/client';
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

export interface ShowToolBarOptionsMenuAction extends Action {
  kind: typeof ShowToolBarOptionsMenuAction.KIND;
  customIconState: () => boolean;
  grid: () => boolean;
  theme?: () => string;
}

export namespace ShowToolBarOptionsMenuAction {
  export const KIND = 'showToolBarOptionsMenu';

  export function create(options: {
    customIconState: () => boolean;
    grid: () => boolean;
    theme?: () => string;
  }): ShowToolBarOptionsMenuAction {
    return {
      kind: KIND,
      ...options
    };
  }

  export function is(object: any): object is ShowToolBarOptionsMenuAction {
    return Action.hasKind(object, KIND);
  }
}
