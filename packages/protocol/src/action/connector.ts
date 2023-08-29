import { Operation } from '@eclipse-glsp/protocol';

export interface StraightenEdgeOperation extends Operation {
  kind: typeof StraightenEdgeOperation.KIND;
  elementId: string;
}

export namespace StraightenEdgeOperation {
  export const KIND = 'straightenEdge';

  export function create(options: { elementId: string }): StraightenEdgeOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}

export interface AutoBendEdgeOperation extends Operation {
  kind: typeof AutoBendEdgeOperation.KIND;
  elementId: string;
}

export namespace AutoBendEdgeOperation {
  export const KIND = 'autoBendEdge';

  export function create(options: { elementId: string }): AutoBendEdgeOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}
