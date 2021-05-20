/********************************************************************************
 * Copyright (c) 2019 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
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
}

export function addSmartActionHandles(element: SParentElement): void {
    removeSmartActionHandles(element);
    element.add(new SSmartActionHandle(SmartActionHandleLocation.TopLeft));
}

export function removeSmartActionHandles(element: SParentElement): void {
    element.removeAll(child => child instanceof SSmartActionHandle);
}
