import { Operation } from '@eclipse-glsp/client';

export class AutoAlignOperation implements Operation {
  static readonly KIND = 'autoAlign';

  constructor(public readonly elementIds: string[], public readonly kind: string = AutoAlignOperation.KIND) {}
}
