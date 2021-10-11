import { Action } from '@eclipse-glsp/client';

export class CustomIconToggleAction implements Action {
  static readonly KIND = 'toggleCustomIcons';

  constructor(public readonly showCustomIcons: boolean,
    public readonly kind: string = CustomIconToggleAction.KIND) { }
}
