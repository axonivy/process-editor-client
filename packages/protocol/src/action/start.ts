import { Action, hasStringProp } from '@eclipse-glsp/protocol';

export interface StartProcessAction extends Action {
  kind: typeof StartProcessAction.KIND;
  elementId: string;
  processStartUri: string;
}

export namespace StartProcessAction {
  export const KIND = 'startProcess';

  export function create(elementId: string, processStartUri: string): StartProcessAction {
    return {
      kind: KIND,
      elementId,
      processStartUri
    };
  }

  export function is(object: any): object is StartProcessAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'elementId') && hasStringProp(object, 'processStartUri');
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
