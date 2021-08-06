import {
  Args,
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
  layoutContainerFeature,
  moveFeature,
  Nameable,
  nameFeature,
  openFeature,
  Point,
  popupFeature,
  RectangularNode,
  SArgumentable,
  SEdge,
  selectFeature,
  SLabel,
  SRoutableElement,
  translate,
  WithEditableLabel,
  withEditLabelFeature
} from '@eclipse-glsp/client';

import { Animateable, animateFeature } from '../animate/model';
import { breakpointFeature } from '../breakpoint/model';
import { smartActionFeature } from '../smart-action/model';
import { NodeIcon, resolveIcon } from './icons';

export class LaneNode extends RectangularNode {
  static readonly DEFAULT_FEATURES = [boundsFeature, layoutContainerFeature, fadeFeature, nameFeature];
}

export class ActivityNode extends RectangularNode implements Nameable, WithEditableLabel, Animateable, SArgumentable {
  static readonly DEFAULT_FEATURES = [connectableFeature, deletableFeature, selectFeature, boundsFeature, smartActionFeature, animateFeature,
    moveFeature, layoutContainerFeature, fadeFeature, hoverFeedbackFeature, popupFeature, nameFeature, withEditLabelFeature, openFeature, breakpointFeature];

  name = '';
  duration?: number;
  taskType?: string;
  reference?: string;
  animated = false;
  args: Args;

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

  get icon(): NodeIcon {
    const iconUri = this.args?.iconUri as string;
    return resolveIcon(iconUri);
  }
}

export class EventNode extends CircularNode implements Animateable, SArgumentable {
  static readonly DEFAULT_FEATURES = [connectableFeature, deletableFeature, selectFeature, boundsFeature, animateFeature,
    moveFeature, layoutContainerFeature, fadeFeature, hoverFeedbackFeature, popupFeature, openFeature, breakpointFeature];

  animated = false;
  args: Args;

  get icon(): NodeIcon {
    const iconUri = this.args?.iconUri as string;
    return resolveIcon(iconUri);
  }
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
