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
  EditableLabel,
  editFeature,
  EMPTY_BOUNDS,
  fadeFeature,
  GLSPGraph,
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
  SChildElement,
  SEdge,
  selectFeature,
  SLabel,
  SRoutableElement,
  translate,
  WithEditableLabel,
  withEditLabelFeature
} from '@eclipse-glsp/client';

import { Animateable, animateFeature } from '../animate/model';
import { errorBoundaryFeature } from '../boundary/model';
import { breakpointFeature } from '../breakpoint/model';
import { quickActionFeature } from '../quick-action/model';
import { NodeIcon, resolveIcon } from './icons';
import { ActivityTypes, LaneTypes } from './view-types';

export class IvyGLSPGraph extends GLSPGraph {
  scroll = { x: 0, y: -50 };
}

export class LaneNode extends RectangularNode implements WithEditableLabel {
  static readonly DEFAULT_FEATURES = [boundsFeature, layoutContainerFeature, fadeFeature, nameFeature];

  get editableLabel(): (SChildElement & EditableLabel) | undefined {
    const label = this.children.find(element => element.type === LaneTypes.LABEL);
    if (label && isEditableLabel(label)) {
      return label;
    }
    return undefined;
  }
}

export class ActivityNode extends RectangularNode implements Nameable, WithEditableLabel, Animateable, SArgumentable {
  static readonly DEFAULT_FEATURES = [connectableFeature, deletableFeature, selectFeature, boundsFeature, quickActionFeature, animateFeature,
    moveFeature, layoutContainerFeature, fadeFeature, hoverFeedbackFeature, popupFeature, nameFeature, withEditLabelFeature, openFeature, breakpointFeature,
    errorBoundaryFeature];

  name = '';
  duration?: number;
  taskType?: string;
  reference?: string;
  animated = false;
  args: Args;

  get editableLabel(): (SChildElement & EditableLabel) | undefined {
    const label = this.children.find(element => element.type === ActivityTypes.LABEL);
    if (label && isEditableLabel(label)) {
      return label;
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
    moveFeature, layoutContainerFeature, fadeFeature, hoverFeedbackFeature, popupFeature, openFeature, breakpointFeature, quickActionFeature];

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
    moveFeature, layoutContainerFeature, fadeFeature, hoverFeedbackFeature, popupFeature, openFeature, breakpointFeature, quickActionFeature];

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
