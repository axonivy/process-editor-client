import {
  Bounds,
  boundsFeature,
  center,
  centerOfLine,
  CircularNode,
  combine,
  connectableFeature,
  deletableFeature,
  DiamondNode,
  editFeature,
  EMPTY_BOUNDS,
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
  Point,
  popupFeature,
  RectangularNode,
  SEdge,
  selectFeature,
  SLabel,
  SRoutableElement,
  SShapeElement,
  translate,
  WithEditableLabel,
  withEditLabelFeature
} from '@eclipse-glsp/client';

import { Animateable, animateFeature } from '../animate/model';
import { breakpointFeature } from '../breakpoint/model';
import { jumpFeature } from '../jump/model';
import { smartActionFeature } from '../smart-action/model';

export class LaneNode extends RectangularNode {
  static readonly DEFAULT_FEATURES = [boundsFeature, layoutContainerFeature, fadeFeature, nameFeature];
}

export class TaskNode extends RectangularNode implements Nameable, WithEditableLabel, Animateable {
  static readonly DEFAULT_FEATURES = [connectableFeature, deletableFeature, selectFeature, boundsFeature, smartActionFeature, animateFeature,
    moveFeature, layoutContainerFeature, fadeFeature, hoverFeedbackFeature, popupFeature, nameFeature, withEditLabelFeature, openFeature, breakpointFeature];

  name = '';
  duration?: number;
  taskType?: string;
  reference?: string;
  animated = false;

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

export class EventNode extends CircularNode implements Animateable {
  static readonly DEFAULT_FEATURES = [connectableFeature, deletableFeature, selectFeature, boundsFeature, animateFeature,
    moveFeature, layoutContainerFeature, fadeFeature, hoverFeedbackFeature, popupFeature, openFeature, breakpointFeature];

  animated = false;
}

export class EndEventNode extends EventNode {
  canConnect(routable: SRoutableElement, role: string): boolean {
    return super.canConnect(routable, role) && role === 'target';
  }
}

export class StartEventNode extends EventNode {
  canConnect(routable: SRoutableElement, role: string): boolean {
    return super.canConnect(routable, role) && role === 'source';
  }
}

export class GatewayNode extends DiamondNode implements Animateable {
  static readonly DEFAULT_FEATURES = [connectableFeature, deletableFeature, selectFeature, boundsFeature, animateFeature,
    moveFeature, layoutContainerFeature, fadeFeature, hoverFeedbackFeature, popupFeature, openFeature, breakpointFeature];

  animated = false;
  size = {
    width: 32,
    height: 32
  };
}

export class Edge extends SEdge {
  static readonly DEFAULT_FEATURES = [editFeature, deletableFeature, selectFeature, fadeFeature,
    hoverFeedbackFeature, popupFeature];

  get bounds(): Bounds {
    // this should also work for splines, which have the convex hull property
    return this.routingPoints.reduce<Bounds>((bounds, routingPoint) => combine(bounds, {
      x: routingPoint.x,
      y: routingPoint.y,
      width: 0,
      height: 0
    }), this.centerBounds());
  }

  private centerBounds(): Bounds {
    const sourcePoint: Point = center(this.source?.bounds || EMPTY_BOUNDS);
    const targetPoint: Point = center(this.target?.bounds || EMPTY_BOUNDS);
    return translate(EMPTY_BOUNDS, centerOfLine(sourcePoint, targetPoint));
  }
}

export class RotateLabel extends SLabel {
  static readonly DEFAULT_FEATURES = [fadeFeature];
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
