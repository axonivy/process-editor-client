import { Action, DeleteElementOperation } from '@eclipse-glsp/client';
import {
    BoundsAware,
    Hoverable,
    hoverFeedbackFeature,
    isBoundsAware,
    isSelectable,
    SChildElement,
    Selectable,
    SModelElement,
    SParentElement
} from 'sprotty';

import { SmartActionTriggerEdgeCreationAction } from '../edge/edge-creation-tool';

export const smartActionFeature = Symbol('smartActionFeature');

export interface Smartable extends BoundsAware, Selectable {
}

export function isSmartable(element: SModelElement): element is SParentElement & Smartable {
    return isBoundsAware(element) && isSelectable(element) && element instanceof SParentElement && element.hasFeature(smartActionFeature);
}

export enum SmartActionHandleLocation {
    TopLeft = 'top-left',
    TopRight = 'top-right',
    BottomLeft = 'bottom-left',
    BottomRight = 'bottom-right'
}

export class SSmartActionHandle extends SChildElement implements Hoverable {
    static readonly TYPE = 'smart-action-handle';

    constructor(public readonly location?: SmartActionHandleLocation,
        public readonly type: string = SSmartActionHandle.TYPE,
        public readonly hoverFeedback: boolean = false) {
        super();
    }

    hasFeature(feature: symbol): boolean {
        return feature === hoverFeedbackFeature;
    }

    mouseUp(target: SModelElement): Action[] {
        return [];
    }

    public icon(): string {
        return '';
    }
}

export class SSmartActionDeleteHandle extends SSmartActionHandle {
    mouseUp(target: SModelElement): Action[] {
        return [new DeleteElementOperation([target.id])];
    }

    public icon(): string {
        return 'trash';
    }
}

export class SSmartActionConnectHandle extends SSmartActionHandle {
    mouseUp(target: SModelElement): Action[] {
        return [new SmartActionTriggerEdgeCreationAction('edge', target.id)];
    }

    public icon(): string {
        return 'long-arrow-alt-right';
    }
}

export function addSmartActionHandles(element: SParentElement): void {
    removeSmartActionHandles(element);
    element.add(new SSmartActionDeleteHandle(SmartActionHandleLocation.TopLeft));
    element.add(new SSmartActionConnectHandle(SmartActionHandleLocation.TopRight));
}

export function removeSmartActionHandles(element: SParentElement): void {
    element.removeAll(child => child instanceof SSmartActionHandle);
}