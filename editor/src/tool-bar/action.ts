import { Action } from '@eclipse-glsp/protocol';

export interface UpdateColorPaletteAction extends Action {
  kind: typeof UpdateColorPaletteAction.KIND;
}

export namespace UpdateColorPaletteAction {
  export const KIND = 'updateColorPalette';

  export function create(): UpdateColorPaletteAction {
    return {
      kind: KIND
    };
  }
}
