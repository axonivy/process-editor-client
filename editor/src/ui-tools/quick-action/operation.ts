import { Operation } from '@eclipse-glsp/client';

export interface AutoAlignOperation extends Operation {
  kind: typeof AutoAlignOperation.KIND;
  elementIds: string[];
}

export namespace AutoAlignOperation {
  export const KIND = 'autoAlign';

  export function create(options: { elementIds: string[] }): AutoAlignOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}
