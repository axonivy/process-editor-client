import { Action, DeleteElementOperation } from '@eclipse-glsp/client';
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
import { SmartActionTriggerEdgeCreationAction } from './edge/edge-creation-tool';

export const smartActionFeature = Symbol('smartActionFeature');

export interface Smartable extends BoundsAware, Selectable {
}

export function isSmartable(element: SModelElement): element is SParentElement & Smartable {
  return isBoundsAware(element) && isSelectable(element) && element instanceof SParentElement && element.hasFeature(smartActionFeature);
}

export enum SmartActionHandleLocation {
  TopLeft = 'top-left',
  Right = 'right',
  BottomLeft = 'bottom-left'
}

export class SSmartActionHandle extends SChildElement implements Hoverable {
  static readonly TYPE = 'smart-action-handle';

  constructor(public readonly icon: string,
    public readonly location: SmartActionHandleLocation,
    public readonly position: number,
    public readonly action: Action,
    public readonly type = SSmartActionHandle.TYPE,
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

export function removeSmartActionHandles(element: SParentElement): void {
  element.removeAll(child => child instanceof SSmartActionHandle);
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
export class ConnectQuickActionProvider implements QuickActionProvider {
  quickActionForElement(element: SModelElement): QuickAction | undefined {
    if (element instanceof SNode && element.canConnect(new SEdge(), 'source')) {
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
  location: SmartActionHandleLocation;
  sorting: string;
  action: Action;
}

class DeleteQuickAction implements QuickAction {
  constructor(public readonly elementId: string,
    public readonly icon = 'fa-trash',
    public readonly location = SmartActionHandleLocation.TopLeft,
    public readonly sorting = 'A',
    public readonly action = new DeleteElementOperation([elementId])) {
  }
}

class ConnectQuickAction implements QuickAction {
  constructor(public readonly elementId: string,
    public readonly icon = 'fa-long-arrow-alt-right',
    public readonly location = SmartActionHandleLocation.Right,
    public readonly sorting = 'A',
    public readonly action = new SmartActionTriggerEdgeCreationAction('edge', elementId)) {
  }
}

class JumpQuickAction implements QuickAction {
  constructor(public readonly elementId: string,
    public readonly icon = 'fa-level-down-alt',
    public readonly location = SmartActionHandleLocation.BottomLeft,
    public readonly sorting = 'A',
    public readonly action = new JumpOperation(elementId)) {
  }
}
