import {
    boundsFeature,
    CircularNode,
    connectableFeature,
    deletableFeature,
    DiamondNode,
    editFeature,
    fadeFeature,
    hoverFeedbackFeature,
    isEditableLabel,
    layoutableChildFeature,
    LayoutContainer,
    layoutContainerFeature,
    moveFeature,
    Nameable,
    nameFeature,
    openFeature,
    popupFeature,
    RectangularNode,
    SEdge,
    selectFeature,
    SRoutableElement,
    SShapeElement,
    WithEditableLabel,
    withEditLabelFeature
} from '@eclipse-glsp/client';

import { smartActionFeature } from '../';
import { jumpFeature } from '../jump/model';

export class TaskNode extends RectangularNode implements Nameable, WithEditableLabel {
    static readonly DEFAULT_FEATURES = [connectableFeature, deletableFeature, selectFeature, boundsFeature, smartActionFeature,
        moveFeature, layoutContainerFeature, fadeFeature, hoverFeedbackFeature, popupFeature, nameFeature, withEditLabelFeature, openFeature];

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

export class SubTaskNode extends TaskNode {
    static readonly DEFAULT_FEATURES = [connectableFeature, deletableFeature, selectFeature, boundsFeature, smartActionFeature, jumpFeature,
        moveFeature, layoutContainerFeature, fadeFeature, hoverFeedbackFeature, popupFeature, nameFeature, withEditLabelFeature, openFeature];
}

export class EventNode extends CircularNode {
    static readonly DEFAULT_FEATURES = [connectableFeature, deletableFeature, selectFeature, boundsFeature,
        moveFeature, layoutContainerFeature, fadeFeature, hoverFeedbackFeature, popupFeature, openFeature];
}

export class EndEventNode extends EventNode {
    canConnect(routable: SRoutableElement, role: string): boolean {
        return super.canConnect(routable, role) && role !== 'source';
    }
}

export class StartEventNode extends EventNode {
    canConnect(routable: SRoutableElement, role: string): boolean {
        return super.canConnect(routable, role) && role !== 'target';
    }
}

export class ActivityNode extends DiamondNode {
    static readonly DEFAULT_FEATURES = [connectableFeature, deletableFeature, selectFeature, boundsFeature,
        moveFeature, layoutContainerFeature, fadeFeature, hoverFeedbackFeature, popupFeature, openFeature];

    size = {
        width: 32,
        height: 32
    };
}

export class Edge extends SEdge {
    static readonly DEFAULT_FEATURES = [editFeature, deletableFeature, selectFeature, fadeFeature,
        hoverFeedbackFeature, popupFeature];
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
