import { Action, hasStringProp } from '@eclipse-glsp/protocol';

export interface OpenInscriptionAction extends Action {
  kind: typeof OpenInscriptionAction.KIND;
  elementId: string;
}

export namespace OpenInscriptionAction {
  export const KIND = 'openInscription';

  export function is(object: any): object is OpenInscriptionAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'elementId');
  }

  export function create(elementId: string): OpenInscriptionAction {
    return {
      kind: KIND,
      elementId
    };
  }
}
