import { Action, hasStringProp } from '@eclipse-glsp/protocol';

export interface OpenSwtInscriptionAction extends Action {
  kind: typeof OpenSwtInscriptionAction.KIND;
  elementId: string;
}

export namespace OpenSwtInscriptionAction {
  export const KIND = 'openInscription';

  export function is(object: any): object is OpenSwtInscriptionAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'elementId');
  }

  export function create(elementId: string): OpenSwtInscriptionAction {
    return {
      kind: KIND,
      elementId
    };
  }
}
