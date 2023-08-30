import { Action } from '@eclipse-glsp/protocol';

export interface StartProcessAction extends Action {
  kind: typeof StartProcessAction.KIND;
  elementId: string;
}

export namespace StartProcessAction {
  export const KIND = 'startProcess';

  export function create(elementId: string): StartProcessAction {
    return {
      kind: KIND,
      elementId
    };
  }
}

export interface SearchProcessCallersAction extends Action {
  kind: typeof SearchProcessCallersAction.KIND;
  elementId: string;
}

export namespace SearchProcessCallersAction {
  export const KIND = 'searchProcessCallers';

  export function create(elementId: string): SearchProcessCallersAction {
    return {
      kind: KIND,
      elementId
    };
  }
}
