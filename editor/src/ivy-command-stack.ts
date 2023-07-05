import { GLSPCommandStack, IActionDispatcher, RedoAction, SModelRoot, TYPES, UndoAction } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

@injectable()
export class IvyGLSPCommandStack extends GLSPCommandStack {
  @inject(TYPES.IActionDispatcherProvider) protected actionDispatcher: () => Promise<IActionDispatcher>;

  override undo(): Promise<SModelRoot> {
    this.actionDispatcher().then(dispatcher => dispatcher.dispatch(UndoAction.create()));
    return this.thenUpdate();
  }

  override redo(): Promise<SModelRoot> {
    this.actionDispatcher().then(dispatcher => dispatcher.dispatch(RedoAction.create()));
    return this.thenUpdate();
  }
}
