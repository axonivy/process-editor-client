import { Operation } from '@eclipse-glsp/protocol';

export interface ChangeActivityTypeOperation extends Operation {
  kind: typeof ChangeActivityTypeOperation.KIND;
  elementId: string;
  typeId: string;
}

export namespace ChangeActivityTypeOperation {
  export const KIND = 'changeActivityType';

  export function create(options: { elementId: string; typeId: string }): ChangeActivityTypeOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}
