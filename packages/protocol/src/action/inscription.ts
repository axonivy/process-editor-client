import { Action } from '@eclipse-glsp/protocol';

export interface OpenInscriptionAction extends Action {
  kind: typeof OpenInscriptionAction.KIND;
  elementId: string;
}

export namespace OpenInscriptionAction {
  export const KIND = 'openInscription';

  export function create(elementId: string): OpenInscriptionAction {
    return {
      kind: KIND,
      elementId
    };
  }
}
