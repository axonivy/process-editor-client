import { Action } from '@eclipse-glsp/protocol';

export interface GoToSourceAction extends Action {
  kind: typeof GoToSourceAction.KIND;
  elementId: string;
}

export namespace GoToSourceAction {
  export const KIND = 'goToSource';

  export function create(elementId: string): GoToSourceAction {
    return {
      kind: KIND,
      elementId
    };
  }
}
