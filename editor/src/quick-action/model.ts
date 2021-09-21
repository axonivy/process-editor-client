import { Action, DeleteElementOperation, isOpenable, OpenAction } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import {
  BoundsAware,
  Hoverable,
  hoverFeedbackFeature,
  isBoundsAware,
  isDeletable,
  isSelectable,
  SChildElement,
  SEdge,
  Selectable,
  SModelElement,
  SNode,
  SParentElement
} from 'sprotty';

import { isJumpable } from '../jump/model';
import { JumpOperation } from '../jump/operation';
import { QuickActionTriggerEdgeCreationAction } from './edge/edge-creation-tool';

export const quickActionFeature = Symbol('quickActionFeature');

export interface QuickActionAware extends BoundsAware, Selectable {
}

export function isQuickActionAware(element: SModelElement): element is SParentElement & QuickActionAware {
  return isBoundsAware(element) && isSelectable(element) && element instanceof SParentElement && element.hasFeature(quickActionFeature);
}

export enum QuickActionHandleLocation {
  TopLeft = 'top-left',
  Left = 'left',
  Right = 'right',
  BottomLeft = 'bottom-left'
}

export class QuickActionHandle extends SChildElement implements Hoverable {
  static readonly TYPE = 'quick-action-handle';

  constructor(public readonly icon: string,
    public readonly location: QuickActionHandleLocation,
    public readonly position: number,
    public readonly action: Action,
    public readonly type = QuickActionHandle.TYPE,
    public readonly hoverFeedback = false) {
    super();
  }

  hasFeature(feature: symbol): boolean {
    return feature === hoverFeedbackFeature;
  }

  mouseUp(target: SModelElement): Action[] {
    return [this.action];
  }
}

export function removeQuickActionHandles(element: SParentElement): void {
  element.removeAll(child => child instanceof QuickActionHandle);
}

export const IVY_TYPES = {
  QuickActionProvider: Symbol.for('QuickActionProvider')
};

export interface QuickActionProvider {
  quickActionForElement(element: SModelElement): QuickAction | undefined;
}

@injectable()
export class DeleteQuickActionProvider implements QuickActionProvider {
  quickActionForElement(element: SModelElement): QuickAction | undefined {
    if (isDeletable(element)) {
      return new DeleteQuickAction(element.id);
    }
    return undefined;
  }
}

@injectable()
export class InscribeQuickActionProvider implements QuickActionProvider {
  quickActionForElement(element: SModelElement): QuickAction | undefined {
    if (isOpenable(element)) {
      return new InscribeQuickAction(element.id);
    }
    return undefined;
  }
}

@injectable()
export class ConnectQuickActionProvider implements QuickActionProvider {
  quickActionForElement(element: SModelElement): QuickAction | undefined {
    const edge = new SEdge();
    edge.type = 'edge';
    if (element instanceof SNode && element.canConnect(edge, 'source')) {
      return new ConnectQuickAction(element.id);
    }
    return undefined;
  }
}

@injectable()
export class JumpQuickActionProvider implements QuickActionProvider {
  quickActionForElement(element: SModelElement): QuickAction | undefined {
    if (isJumpable(element)) {
      return new JumpQuickAction(element.id);
    }
    return undefined;
  }
}

export interface QuickAction {
  icon: string;
  location: QuickActionHandleLocation;
  sorting: string;
  action: Action;
}

class DeleteQuickAction implements QuickAction {
  constructor(public readonly elementId: string,
    public readonly icon = 'fa-trash',
    public readonly location = QuickActionHandleLocation.TopLeft,
    public readonly sorting = 'A',
    public readonly action = new DeleteElementOperation([elementId])) {
  }
}

class InscribeQuickAction implements QuickAction {
  constructor(public readonly elementId: string,
    public readonly icon = 'fa-pen',
    public readonly location = QuickActionHandleLocation.TopLeft,
    public readonly sorting = 'B',
    public readonly action = new OpenAction(elementId)) {
  }
}

class ConnectQuickAction implements QuickAction {
  constructor(public readonly elementId: string,
    public readonly icon = 'fa-long-arrow-alt-right',
    public readonly location = QuickActionHandleLocation.Right,
    public readonly sorting = 'A',
    public readonly action = new QuickActionTriggerEdgeCreationAction('edge', elementId)) {
  }
}

class JumpQuickAction implements QuickAction {
  constructor(public readonly elementId: string,
    public readonly icon = 'fa-level-down-alt',
    public readonly location = QuickActionHandleLocation.BottomLeft,
    public readonly sorting = 'A',
    public readonly action = new JumpOperation(elementId)) {
  }
}
