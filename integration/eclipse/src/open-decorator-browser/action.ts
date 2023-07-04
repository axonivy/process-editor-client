import { Action } from '@eclipse-glsp/protocol';

export interface OpenDecoratorBrowserAction extends Action {
  kind: typeof OpenDecoratorBrowserAction.KIND;
  elementId: string;
}

export namespace OpenDecoratorBrowserAction {
  export const KIND = 'openDecoratorBrowser';

  export function create(elementId: string): OpenDecoratorBrowserAction {
    return {
      kind: KIND,
      elementId
    };
  }
}
