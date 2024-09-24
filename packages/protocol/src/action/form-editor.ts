import { Action } from '@eclipse-glsp/protocol';

export interface OpenFormEditorAction extends Action {
  kind: typeof OpenFormEditorAction.KIND;
}

export namespace OpenFormEditorAction {
  export const KIND = 'openFormEditor';

  export function create(): OpenFormEditorAction {
    return {
      kind: KIND
    };
  }

  export function is(object: any): object is OpenFormEditorAction {
    return Action.hasKind(object, KIND);
  }
}
