import { Action } from '@eclipse-glsp/client';

export interface EditSourceAction extends Action {
  kind: typeof EditSourceAction.KIND;
  elementId: string;
}

export namespace EditSourceAction {
  export const KIND = 'editSource';

  export function create(elementId: string): EditSourceAction {
    return {
      kind: KIND,
      elementId
    };
  }
}
