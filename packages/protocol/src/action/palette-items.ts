import { Action } from '@eclipse-glsp/protocol';

export interface UpdatePaletteItems extends Action {
  kind: typeof UpdatePaletteItems.KIND;
}

export namespace UpdatePaletteItems {
  export const KIND = 'updatePaletteItems';

  export function create(): UpdatePaletteItems {
    return { kind: KIND };
  }

  export function is(object: any): object is UpdatePaletteItems {
    return Action.hasKind(object, KIND);
  }
}
