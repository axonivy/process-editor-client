import { Action, Operation, PaletteItem } from '@eclipse-glsp/protocol';

export interface ChangeColorOperation extends Operation {
  kind: typeof ChangeColorOperation.KIND;
  elementIds: string[];
  color?: string;
  colorName?: string;
  oldColor?: string;
}

export namespace ChangeColorOperation {
  export const KIND = 'changeColor';

  export function changeColor(options: {
    elementIds: string[];
    color: string;
    colorName: string;
    oldColor?: string;
  }): ChangeColorOperation {
    return create(options);
  }

  export function deleteColor(options: { elementIds: string[]; oldColor: string }): ChangeColorOperation {
    return create(options);
  }

  export function create(options: { elementIds: string[]; color?: string; colorName?: string; oldColor?: string }): ChangeColorOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}

export interface UpdateColorPaletteAction extends Action {
  kind: typeof UpdateColorPaletteAction.KIND;
  paletteItems: PaletteItem[];
}

export namespace UpdateColorPaletteAction {
  export const KIND = 'updateColorPalette';

  export function is(object: any): object is UpdateColorPaletteAction {
    return Action.hasKind(object, KIND);
  }
}

