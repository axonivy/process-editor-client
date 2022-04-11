import { Action } from 'sprotty';

export class OpenInsertConnectorAction implements Action {
  static readonly KIND = 'openInsertConnector';
  constructor(public readonly kind: string = OpenInsertConnectorAction.KIND) {}
}
