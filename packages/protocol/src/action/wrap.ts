import { Operation } from '@eclipse-glsp/protocol';

export interface WrapToSubOperation extends Operation {
  kind: typeof WrapToSubOperation.KIND;
  elementIds: string[];
}

export namespace WrapToSubOperation {
  export const KIND = 'wrapToSub';

  export function create(options: { elementIds: string[] }): WrapToSubOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}

export interface UnwrapSubOperation extends Operation {
  kind: typeof UnwrapSubOperation.KIND;
  elementId: string;
}

export namespace UnwrapSubOperation {
  export const KIND = 'unwrapSub';

  export function create(options: { elementId: string }): UnwrapSubOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}
