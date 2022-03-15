import { Action } from 'sprotty';

export class EditSourceAction implements Action {
  static readonly KIND = 'editSource';
  constructor(readonly elementId: string, public readonly kind: string = EditSourceAction.KIND) {}
}
