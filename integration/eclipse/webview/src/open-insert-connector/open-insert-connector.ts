import { Action } from '@eclipse-glsp/client';

export interface OpenInsertConnectorAction extends Action {
  kind: typeof OpenInsertConnectorAction.KIND;
}

export namespace OpenInsertConnectorAction {
  export const KIND = 'openInsertConnector';

  export function create(): OpenInsertConnectorAction {
    return {
      kind: KIND
    };
  }
}
