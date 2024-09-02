import { Action, hasStringProp } from '@eclipse-glsp/protocol';

export interface JumpAction extends Action {
  kind: typeof JumpAction.KIND;
  elementId: string;
  noViewportUpdate?: boolean;
}

export namespace JumpAction {
  export const KIND = 'jumpInto';

  export function create(options: { elementId: string; noViewportUpdate?: boolean }): JumpAction {
    return {
      kind: KIND,
      ...options
    };
  }

  export function is(object: any): object is JumpAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'elementId');
  }
}
