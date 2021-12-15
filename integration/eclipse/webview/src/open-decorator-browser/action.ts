import { Action } from '@eclipse-glsp/protocol';

export class OpenDecoratorBrowserAction implements Action {
  static readonly KIND = 'openDecoratorBrowser';
  constructor(readonly elementId: string, readonly reset: boolean, public readonly kind: string = OpenDecoratorBrowserAction.KIND) {}
}
