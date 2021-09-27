import {
  Action,
  DeleteElementOperation,
  isDeletable,
  isOpenable,
  OpenAction,
  SEdge,
  SModelElement,
  SNode
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';

import { isJumpable } from '../jump/model';
import { JumpOperation } from '../jump/operation';
import { AutoAlignOperation } from '../tool-palette/operation';
import { QuickActionTriggerEdgeCreationAction } from './edge/edge-creation-tool';

export enum QuickActionLocation {
  TopLeft = 'top-left',
  Left = 'left',
  Right = 'right',
  BottomLeft = 'bottom-left'
}

export const IVY_TYPES = {
  QuickActionProvider: Symbol.for('QuickActionProvider')
};

export interface QuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined;
  multiQuickAction(elements: SModelElement[]): QuickAction | undefined;
}

@injectable()
export abstract class SingleQuickActionProvider implements QuickActionProvider {
  abstract singleQuickAction(element: SModelElement): QuickAction | undefined;
  multiQuickAction(elements: SModelElement[]): undefined {
    return undefined;
  }
}

@injectable()
export abstract class MultipleQuickActionProvider implements QuickActionProvider {
  abstract multiQuickAction(elements: SModelElement[]): QuickAction | undefined;
  singleQuickAction(element: SModelElement): undefined {
    return undefined;
  }
}

@injectable()
export class DeleteQuickActionProvider implements QuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isDeletable(element)) {
      return new DeleteQuickAction([element.id]);
    }
    return undefined;
  }

  multiQuickAction(elements: SModelElement[]): QuickAction | undefined {
    const elementIds = elements.filter(e => isDeletable(e))
      .map(e => e.id);
    if (elementIds.length > 0) {
      return new DeleteQuickAction(elementIds);
    }
    return undefined;
  }
}

@injectable()
export class InscribeQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isOpenable(element)) {
      return new InscribeQuickAction(element.id);
    }
    return undefined;
  }
}

@injectable()
export class ConnectQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    const edge = new SEdge();
    edge.type = 'edge';
    if (element instanceof SNode && element.canConnect(edge, 'source')) {
      return new ConnectQuickAction(element.id);
    }
    return undefined;
  }
}

@injectable()
export class JumpQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isJumpable(element)) {
      return new JumpQuickAction(element.id);
    }
    return undefined;
  }
}

@injectable()
export class AutoAlignQuickActionProvider extends MultipleQuickActionProvider {
  multiQuickAction(elements: SModelElement[]): QuickAction | undefined {
    const elementIds = elements.filter(e => isDeletable(e))
      .map(e => e.id);
    if (elementIds.length > 0) {
      return new AutoAlignQuickAction(elementIds);
    }
    return undefined;
  }
}

export interface QuickAction {
  icon: string;
  title: string;
  location: QuickActionLocation;
  sorting: string;
  action: Action;
}

class DeleteQuickAction implements QuickAction {
  constructor(public readonly elementIds: string[],
    public readonly icon = 'fa-trash',
    public readonly title = 'Delete',
    public readonly location = QuickActionLocation.TopLeft,
    public readonly sorting = 'A',
    public readonly action = new DeleteElementOperation(elementIds)) {
  }
}

class InscribeQuickAction implements QuickAction {
  constructor(public readonly elementId: string,
    public readonly icon = 'fa-pen',
    public readonly title = 'Edit',
    public readonly location = QuickActionLocation.TopLeft,
    public readonly sorting = 'B',
    public readonly action = new OpenAction(elementId)) {
  }
}

class ConnectQuickAction implements QuickAction {
  constructor(public readonly elementId: string,
    public readonly icon = 'fa-long-arrow-alt-right',
    public readonly title = 'Connect',
    public readonly location = QuickActionLocation.Right,
    public readonly sorting = 'A',
    public readonly action = new QuickActionTriggerEdgeCreationAction('edge', elementId)) {
  }
}

class JumpQuickAction implements QuickAction {
  constructor(public readonly elementId: string,
    public readonly icon = 'fa-level-down-alt',
    public readonly title = 'Jump',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'A',
    public readonly action = new JumpOperation(elementId)) {
  }
}

class AutoAlignQuickAction implements QuickAction {
  constructor(public readonly elementIds: string[],
    public readonly icon = 'fa-arrows-alt',
    public readonly title = 'Auto Align',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'Z',
    public readonly action = new AutoAlignOperation(elementIds)) {
  }
}
