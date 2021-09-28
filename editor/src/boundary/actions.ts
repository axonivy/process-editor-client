import { Operation, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../quick-action/quick-action';
import { canAddErrorBoundary, canAddSignalBoundary } from './model';

export class AttachBoundaryOperation implements Operation {
  static readonly KIND = 'attachBoundary';

  constructor(public readonly elementId: string,
    public readonly eventKind: string,
    public readonly kind: string = AttachBoundaryOperation.KIND) { }
}

@injectable()
export class AttachErrorBoundaryQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (canAddErrorBoundary(element)) {
      return new AttachErrorBoundaryQuickAction(element.id);
    }
    return undefined;
  }
}

class AttachErrorBoundaryQuickAction implements QuickAction {
  constructor(public readonly elementId: string,
    public readonly icon = 'fa-bolt',
    public readonly title = 'Attach Error',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'E',
    public readonly action = new AttachBoundaryOperation(elementId, 'error')) {
  }
}

@injectable()
export class AttachSignalBoundaryQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (canAddSignalBoundary(element)) {
      return new AttachSignalBoundaryQuickAction(element.id);
    }
    return undefined;
  }
}

class AttachSignalBoundaryQuickAction implements QuickAction {
  constructor(public readonly elementId: string,
    public readonly icon = 'fa-satellite-dish',
    public readonly title = 'Attach Signal',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'S',
    public readonly action = new AttachBoundaryOperation(elementId, 'signal')) {
  }
}
