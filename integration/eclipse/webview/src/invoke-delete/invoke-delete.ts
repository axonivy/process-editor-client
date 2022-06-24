import { Action, DeleteElementOperation, EditorContextService, IActionDispatcher, IActionHandler, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

export class InvokeDeleteAction implements Action {
  static KIND = 'invoke-delete';
  readonly kind = InvokeDeleteAction.KIND;
}

export function isInvokeDeleteAction(action: Action): action is InvokeDeleteAction {
  return action.kind === InvokeDeleteAction.KIND;
}

@injectable()
export class IvyInvokeDeleteActionHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
  @inject(EditorContextService) protected editorContext: EditorContextService;

  handle(action: Action): void {
    if (isInvokeDeleteAction(action)) {
      this.handleDelete();
    }
  }

  handleDelete(): void {
    this.actionDispatcher.dispatch(DeleteElementOperation.create(this.editorContext.get().selectedElementIds));
  }
}
