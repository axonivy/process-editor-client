import { Action, hasArrayProp } from '@eclipse-glsp/protocol';

export interface ElementExecution {
  elementId: string;
  count: number;
  failed: boolean;
}

export interface SetExecutedElementsAction extends Action {
  kind: typeof SetExecutedElementsAction.KIND;
  elementExecutions: ElementExecution[];
  lastExecutedElementId: string;
}

export namespace SetExecutedElementsAction {
  export const KIND = 'setExecutedElements';

  export function is(object: any): object is SetExecutedElementsAction {
    return Action.hasKind(object, KIND) && hasArrayProp(object, 'elementExecutions');
  }

  export function create(options: { elementExecutions: ElementExecution[]; lastExecutedElementId: string }): SetExecutedElementsAction {
    return {
      kind: KIND,
      ...options
    };
  }
}

export interface StoppedAction extends Action {
  kind: typeof StoppedAction.KIND;
  elementId?: string;
}

export namespace StoppedAction {
  export const KIND = 'elementStopped';

  export function is(object: any): object is StoppedAction {
    return Action.hasKind(object, KIND);
  }

  export function create(options: { elementId?: string }): StoppedAction {
    return {
      kind: KIND,
      ...options
    };
  }
}
