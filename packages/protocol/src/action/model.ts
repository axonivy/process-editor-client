import { Action, GModelRootSchema, UpdateModelAction } from '@eclipse-glsp/protocol';
import * as sprotty from 'sprotty-protocol/lib/actions';

export interface ReloadModelAction extends Action, Omit<sprotty.UpdateModelAction, 'matches' | 'cause'> {
  kind: typeof UpdateModelAction.KIND;
  newRoot?: GModelRootSchema;
  animate?: boolean;
}

export namespace ReloadModelAction {
  export function create(newRoot?: GModelRootSchema, options: { animate?: boolean } = {}): ReloadModelAction {
    return {
      kind: UpdateModelAction.KIND,
      newRoot: newRoot,
      ...options
    };
  }
}
