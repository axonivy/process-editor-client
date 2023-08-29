import { Action, hasArrayProp } from '@eclipse-glsp/protocol';

export interface AnimateAction extends Action {
  kind: typeof AnimateAction.KIND;
  elementIds: string[];
}

export namespace AnimateAction {
  export const KIND = 'elementAnimate';

  export function is(object: any): object is AnimateAction {
    return Action.hasKind(object, KIND) && hasArrayProp(object, 'elementIds');
  }

  export function create(options: { elementIds: string[] }): AnimateAction {
    return {
      kind: KIND,
      ...options
    };
  }
}
