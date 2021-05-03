/********************************************************************************
 * Copyright (c) 2020 EclipseSource and others.
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
    boundsFeature,
    CircularNode,
    connectableFeature,
    deletableFeature,
    DiamondNode,
    fadeFeature,
    hoverFeedbackFeature,
    isEditableLabel,
    layoutableChildFeature,
    LayoutContainer,
    layoutContainerFeature,
    moveFeature,
    Nameable,
    nameFeature,
    popupFeature,
    RectangularNode,
    SEdge,
    selectFeature,
    SModelElement,
    SRoutableElement,
    SShapeElement,
    WithEditableLabel,
    withEditLabelFeature
} from '@eclipse-glsp/client';

export class TaskNode extends RectangularNode implements Nameable, WithEditableLabel {
    static readonly DEFAULT_FEATURES = [connectableFeature, deletableFeature, selectFeature, boundsFeature,
        moveFeature, layoutContainerFeature, fadeFeature, hoverFeedbackFeature, popupFeature, nameFeature, withEditLabelFeature];
    name = '';
    duration?: number;
    taskType?: string;
    reference?: string;

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    get editableLabel() {
        const headerComp = this.children.find(element => element.type === 'comp:header');
        if (headerComp) {
            const label = headerComp.children.find(element => element.type === 'label:heading');
            if (label && isEditableLabel(label)) {
                return label;
            }
        }
        return undefined;
    }

    get isCommentBox(): boolean {
        return this.type === 'node:comment';
    }

    get isCallSub(): boolean {
        return this.type === 'node:embeddedproc';
    }

    get isSubProc(): boolean {
        return this.type === 'node:subproc';
    }

    get icon(): string | undefined {
        switch (this.type) {
            case 'node:script':
                return 'fa-cog';
            case 'node:hd':
                return 'fa-desktop';
            case 'node:user':
                return 'fa-user';
            case 'node:soap':
                return 'fa-globe';
            case 'node:rest':
                return 'fa-exchange-alt';
            case 'node:db':
                return 'fa-database';
            case 'node:email':
                return 'fa-envelope';
        }
        return undefined;
    }
}

export function isTaskNode(element: SModelElement): element is TaskNode {
    return element instanceof TaskNode || false;
}

export class WeightedEdge extends SEdge {
    probability?: string;
}

export class EventNode extends CircularNode {
    get isEndNode(): boolean {
        return this.type.startsWith('event:end');
    }

    get isStartNode(): boolean {
        return this.type.startsWith('event:start');
    }

    get isSignalNode(): boolean {
        return this.type.endsWith(':signal');
    }

    get isErrorNode(): boolean {
        return this.type.endsWith(':error');
    }

    canConnect(routable: SRoutableElement, role: string): boolean {
        const canConnect = super.canConnect(routable, role);
        const validNode = !this.isEndNode && !this.isStartNode
            || this.isEndNode && role === 'target'
            || !this.isEndNode && role === 'source';
        return canConnect && validNode;
    }
}

export class ActivityNode extends DiamondNode {
    size = {
        width: 32,
        height: 32
    };
    strokeWidth = 1;
    get isAlternative(): boolean {
        return this.type === 'activity:alternative';
    }
}

export class Icon extends SShapeElement implements LayoutContainer {
    static readonly DEFAULT_FEATURES = [boundsFeature, layoutContainerFeature, layoutableChildFeature, fadeFeature];

    layout: string;
    layoutOptions?: { [key: string]: string | number | boolean };
    size = {
        width: 32,
        height: 32
    };
}
