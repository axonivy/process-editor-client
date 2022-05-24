import { Action } from '@eclipse-glsp/protocol';

export class UpdateColorPaletteAction implements Action {
  static readonly KIND = 'updateColorPalette';

  constructor(public readonly kind: string = UpdateColorPaletteAction.KIND) {}
}
