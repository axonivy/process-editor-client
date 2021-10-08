import { Action } from '@eclipse-glsp/client';

export class JumpAction implements Action {
  static readonly KIND = 'jumpInto';

  constructor(public readonly elementId: string,
    public readonly kind: string = JumpAction.KIND) { }
}
