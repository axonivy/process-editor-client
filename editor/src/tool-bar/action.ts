import { Action } from '@eclipse-glsp/protocol';

export class ChangeColorAction implements Action {
  static readonly KIND = 'changeColor';

  constructor(
    public readonly color: string,
    public readonly colorName: string,
    public readonly oldColor: string,
    public readonly kind: string = ChangeColorAction.KIND
  ) {}
}

export class UpdateColorPaletteAction implements Action {
  static readonly KIND = 'updateColorPalette';

  constructor(public readonly kind: string = ChangeColorAction.KIND) {}
}
