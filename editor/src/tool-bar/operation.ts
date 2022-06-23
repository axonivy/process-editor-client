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

export interface ColorizeOperation extends Operation {
  kind: typeof ColorizeOperation.KIND;
  elementIds: string[];
  color: string;
  colorName: string;
}

export namespace ColorizeOperation {
  export const KIND = 'colorize';

  export function create(options: { elementIds: string[]; color: string; colorName: string }): ColorizeOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}

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

export interface ChangeColorOperation extends Operation {
  kind: typeof ChangeColorOperation.KIND;
  color: string;
  colorName: string;
  oldColor: string;
}

export namespace ChangeColorOperation {
  export const KIND = 'changeColor';

  export function create(options: { color: string; colorName: string; oldColor: string }): ChangeColorOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}
