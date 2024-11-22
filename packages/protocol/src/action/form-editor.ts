import { Action } from '@eclipse-glsp/protocol';

export interface OpenFormEditorAction extends Action {
  kind: typeof OpenFormEditorAction.KIND;
  elementId?: string;
}

export namespace OpenFormEditorAction {
  export const KIND = 'openFormEditor';
  export function create(options?: { elementId?: string }): OpenFormEditorAction {
    return {
      kind: KIND,
      ...options
    };
  }

  export function is(object: unknown): object is OpenFormEditorAction {
    return Action.hasKind(object, KIND);
  }
}
