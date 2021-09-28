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
  Dimension,
  EditableLabel,
  editFeature,
  editLabelFeature,
  EMPTY_BOUNDS,
  fadeFeature,
  GLSPGraph,
  hoverFeedbackFeature,
  isBoundsAware,
  isEditableLabel,
  layoutContainerFeature,
  moveFeature,
  Nameable,
  nameFeature,
  openFeature,
  ORIGIN_POINT,
  Point,
  popupFeature,
  RectangularNode,
  SArgumentable,
  SChildElement,
  SEdge,
  selectFeature,
  SLabel,
  SParentElement,
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
import { ActivityTypes, LabelType, LaneTypes } from './view-types';

export class IvyGLSPGraph extends GLSPGraph {
  scroll = { x: 0, y: -50 };
}

export class LaneNode extends RectangularNode implements WithEditableLabel {
  static readonly DEFAULT_FEATURES = [boundsFeature, layoutContainerFeature, fadeFeature, nameFeature, withEditLabelFeature];

  get editableLabel(): (SChildElement & EditableLabel) | undefined {
    return findEditableLabel(this, LaneTypes.LABEL);
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
    return findEditableLabel(this, ActivityTypes.LABEL);
  }

  get icon(): NodeIcon {
    const iconUri = this.args?.iconUri as string;
    return resolveIcon(iconUri);
  }
}

export class EventNode extends CircularNode implements Animateable, SArgumentable, WithEditableLabel {
  static readonly DEFAULT_FEATURES = [connectableFeature, deletableFeature, selectFeature, boundsFeature, animateFeature,
    moveFeature, layoutContainerFeature, fadeFeature, hoverFeedbackFeature, popupFeature, openFeature, breakpointFeature, quickActionFeature,
    withEditLabelFeature];

  animated = false;
  args: Args;

  get icon(): NodeIcon {
    const iconUri = this.args?.iconUri as string;
    return resolveIcon(iconUri);
  }

  get editableLabel(): (SChildElement & EditableLabel) | undefined {
    return findEditableLabel(this, LabelType.DEFAULT);
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

export class GatewayNode extends DiamondNode implements Animateable, WithEditableLabel {
  static readonly DEFAULT_FEATURES = [connectableFeature, deletableFeature, selectFeature, boundsFeature, animateFeature,
    moveFeature, layoutContainerFeature, fadeFeature, hoverFeedbackFeature, popupFeature, openFeature, breakpointFeature, quickActionFeature,
    withEditLabelFeature];

  animated = false;
  size = {
    width: 32,
    height: 32
  };

  get editableLabel(): (SChildElement & EditableLabel) | undefined {
    return findEditableLabel(this, LabelType.DEFAULT);
  }
}

export class Edge extends SEdge implements WithEditableLabel {
  static readonly DEFAULT_FEATURES = [editFeature, deletableFeature, selectFeature, fadeFeature,
    hoverFeedbackFeature, popupFeature, withEditLabelFeature];

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

  get editableLabel(): (SChildElement & EditableLabel) | undefined {
    return findEditableLabel(this, LabelType.DEFAULT);
  }
}

export class MulitlineEditLabel extends SLabel implements EditableLabel {
  static readonly DEFAULT_FEATURES = [fadeFeature, editLabelFeature];

  readonly isMultiLine = true;
  get editControlDimension(): Dimension {
    return { width: Math.max(this.bounds.width + 25, 50), height: Math.max(this.bounds.height, 16) };
  }

  get editControlPositionCorrection(): Point {
    return { x: -2, y: -3 };
  }
}

export class RotateLabel extends MulitlineEditLabel {
  get editControlDimension(): Dimension {
    return { width: this.bounds.height, height: this.bounds.width };
  }
}

export class ActivityLabel extends MulitlineEditLabel {
  readonly isMultiLine = true;
  get editControlDimension(): Dimension {
    if (isBoundsAware(this.parent)) {
      return { width: this.parent.bounds.width, height: this.parent.bounds.height };
    }
    return { width: this.bounds.width, height: this.bounds.height };
  }
  get editControlPositionCorrection(): Point {
    if (isBoundsAware(this.parent)) {
      return { x: -this.bounds.x, y: -this.bounds.y };
    }
    return ORIGIN_POINT;
  }
}

function findEditableLabel(element: SParentElement, type: string): (SChildElement & EditableLabel) | undefined {
  const label = element.children.find(e => e.type === type);
  if (label && isEditableLabel(label)) {
    return label;
  }
  return undefined;
}
