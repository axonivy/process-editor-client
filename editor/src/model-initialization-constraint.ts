import { Action, InitializeCanvasBoundsAction, ModelInitializationConstraint, SetModelAction } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyModelInitializationConstraint extends ModelInitializationConstraint {
  protected seenNonEmptySetModel = false;

  isInitializedAfter(action: Action): boolean {
    if (this.isNonEmptySetModel(action)) {
      this.seenNonEmptySetModel = true;
    } else if (this.seenNonEmptySetModel && action.kind === InitializeCanvasBoundsAction.KIND) {
      return true;
    }
    return false;
  }

  protected isNonEmptySetModel(action: Action): boolean {
    if (action && action.kind === SetModelAction.KIND) {
      const setModelAction = action as SetModelAction;
      return setModelAction.newRoot !== undefined && setModelAction.newRoot.type !== 'NONE';
    }
    return false;
  }
}
