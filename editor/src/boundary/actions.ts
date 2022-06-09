import { Operation, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../quick-action/quick-action';
import { canAddErrorBoundary, canAddSignalBoundary } from './model';

export interface AttachBoundaryOperation extends Operation {
  kind: typeof AttachBoundaryOperation.KIND;
  elementId: string;
  eventKind: string;
}

export namespace AttachBoundaryOperation {
  export const KIND = 'attachBoundary';

  export function create(options: { elementId: string; eventKind: string }): AttachBoundaryOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
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
  constructor(
    public readonly elementId: string,
    public readonly icon = 'fa-solid fa-bolt',
    public readonly title = 'Attach Error',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'E',
    public readonly action = AttachBoundaryOperation.create({ elementId: elementId, eventKind: 'error' })
  ) {}
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
  constructor(
    public readonly elementId: string,
    public readonly icon = 'fa-solid fa-satellite-dish',
    public readonly title = 'Attach Signal',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'S',
    public readonly action = AttachBoundaryOperation.create({ elementId: elementId, eventKind: 'signal' })
  ) {}
}
