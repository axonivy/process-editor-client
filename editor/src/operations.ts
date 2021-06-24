import { Operation } from '@eclipse-glsp/client';

export class WrapToSubOperation implements Operation {
  static readonly KIND = 'wrapToSub';

  constructor(public readonly elementIds: string[],
    public readonly kind: string = WrapToSubOperation.KIND) { }
}
