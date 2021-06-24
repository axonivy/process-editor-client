import { inject, injectable } from 'inversify';
import { Action, IActionDispatcher, IActionHandler, OpenAction, TYPES } from 'sprotty';

export function isInvokeOpenAction(action: Action): action is OpenAction {
  return action.kind === OpenAction.KIND;
}

@injectable()
export class OpenInscriptionActionHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
  handle(action: Action): void {
    if (isInvokeOpenAction(action)) {
      this.handleOpen(action.elementId);
    }
  }

  handleOpen(elementId: string): void {
    this.actionDispatcher.dispatch(new OpenInscriptionAction(elementId));
  }
}

export class OpenInscriptionAction implements Action {
  static readonly KIND = 'openInscription';
  constructor(readonly elementId: string, public readonly kind: string = OpenInscriptionAction.KIND) { }
}
