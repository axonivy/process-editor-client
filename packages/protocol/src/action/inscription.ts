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

export interface EnableInscriptionAction extends Action {
  kind: typeof EnableInscriptionAction.KIND;
  server?: string;
  app?: string;
  pmv?: string;
}

export namespace EnableInscriptionAction {
  export const KIND = 'enableInscription';

  export function is(object: any): object is EnableInscriptionAction {
    return Action.hasKind(object, KIND);
  }

  export function create(options?: { server?: string; app?: string; pmv?: string }): EnableInscriptionAction {
    return { kind: KIND, ...options };
  }
}

export interface ToggleInscriptionAction extends Action {
  kind: typeof ToggleInscriptionAction.KIND;
}

export namespace ToggleInscriptionAction {
  export const KIND = 'showInscription';

  export function is(object: any): object is ToggleInscriptionAction {
    return Action.hasKind(object, KIND);
  }

  export function create(): ToggleInscriptionAction {
    return { kind: KIND };
  }
}
