import { Operation } from '@eclipse-glsp/client';

export class AutoAlignOperation implements Operation {
  static readonly KIND = 'autoAlign';

  constructor(public readonly elementIds: string[], public readonly kind: string = AutoAlignOperation.KIND) {}
}

export class ColorizeOperation implements Operation {
  static readonly KIND = 'colorize';

  constructor(
    public readonly elementIds: string[],
    public readonly color: string,
    public readonly colorName: string,
    public readonly kind: string = ColorizeOperation.KIND
  ) {}
}

export class ChangeActivityTypeOperation implements Operation {
  static readonly KIND = 'changeActivityType';

  constructor(
    public readonly elementId: string,
    public readonly typeId: string,
    public readonly kind: string = ChangeActivityTypeOperation.KIND
  ) {}
}
