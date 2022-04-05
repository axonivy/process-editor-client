import { Action } from '@eclipse-glsp/protocol';

export class OpenDecoratorBrowserAction implements Action {
  static readonly KIND = 'openDecoratorBrowser';
  constructor(readonly elementId: string, public readonly kind: string = OpenDecoratorBrowserAction.KIND) {}
}
