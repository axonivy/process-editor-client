import {
  Args,
  Bounds,
  boundsFeature,
  centerOfLine,
  CircularNode,
  connectableFeature,
  deletableFeature,
  DiamondNode,
  Dimension,
  EditableLabel,
  editFeature,
  editLabelFeature,
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
  Point,
  popupFeature,
  reconnectFeature,
  RectangularNode,
  resizeFeature,
  SArgumentable,
  SChildElement,
  SEdge,
  selectFeature,
  SLabel,
  SParentElement,
  SRoutableElement,
  WithEditableLabel,
  withEditLabelFeature
} from '@eclipse-glsp/client';
import { wrapFeature } from '../wrap/model';
import { animateFeature } from '../animate/model';
import { errorBoundaryFeature } from './boundary/model';
import { breakpointFeature } from '../breakpoint/model';
import { Executable, executionFeature } from '../execution/model';
import { laneResizeFeature } from '../lanes/model';
import { quickActionFeature } from '../ui-tools/quick-action/model';
import { WithCustomIcon } from './icon/model';
import { ActivityTypes, EdgeTypes, LabelType, LaneTypes } from './view-types';
import { multipleOutgoingEdgesFeature } from '../ui-tools/quick-action/edge/model';

export class IvyGLSPGraph extends GLSPGraph {
  scroll = { x: 0, y: -50 };
}

export class LaneNode extends RectangularNode implements WithEditableLabel, SArgumentable {
  static readonly DEFAULT_FEATURES = [
    boundsFeature,
    layoutContainerFeature,
    fadeFeature,
    nameFeature,
    withEditLabelFeature,
    selectFeature,
    quickActionFeature,
    deletableFeature,
    laneResizeFeature
  ];

  args: Args;

  get editableLabel(): (SChildElement & EditableLabel) | undefined {
    return findEditableLabel(this, LaneTypes.LABEL);
  }

  get color(): string {
    return (this.args?.color as string) ?? '';
  }

  isFirstChild(): boolean {
    if (this.parent instanceof LaneNode) {
      const embeddedLanes = this.parent.embeddedLanes();
      return embeddedLanes.indexOf(this) === 0;
    }
    return false;
  }

  isLastChild(): boolean {
    if (this.parent instanceof LaneNode) {
      const embeddedLanes = this.parent.embeddedLanes();
      return embeddedLanes.indexOf(this) === embeddedLanes.length - 1;
    }
    return false;
  }

  private embeddedLanes(): LaneNode[] {
    return this.children.filter(child => child instanceof LaneNode).map(child => <LaneNode>child);
  }

  canConnect(routable: SRoutableElement, role: string): boolean {
    return false;
  }
}

export class ActivityNode extends RectangularNode implements Nameable, WithEditableLabel, WithCustomIcon, SArgumentable, Executable {
  static readonly DEFAULT_FEATURES = [
    connectableFeature,
    deletableFeature,
    selectFeature,
    boundsFeature,
    resizeFeature,
    quickActionFeature,
    animateFeature,
    moveFeature,
    layoutContainerFeature,
    fadeFeature,
    hoverFeedbackFeature,
    popupFeature,
    nameFeature,
    withEditLabelFeature,
    openFeature,
    breakpointFeature,
    errorBoundaryFeature,
    executionFeature,
    wrapFeature
  ];

  name = '';
  duration?: number;
  taskType?: string;
  reference?: string;
  executionCount?: number;
  args: Args;

  get editableLabel(): (SChildElement & EditableLabel) | undefined {
    return findEditableLabel(this, ActivityTypes.LABEL);
  }

  get icon(): string {
    return this.args?.iconUri as string;
  }

  get customIcon(): string {
    return (this.args?.customIconUri as string) ?? this.icon;
  }

  get color(): string {
    return (this.args?.color as string) ?? '';
  }

  get labelBounds(): Bounds {
    return { x: -this.bounds.width / 2 + 3, y: 18, width: this.bounds.width - 6, height: this.bounds.height - 18 };
  }
}

export class SubActivityNode extends ActivityNode {
  get labelBounds(): Bounds {
    return { ...super.labelBounds, height: super.labelBounds.height - 14 };
  }
}

export class CommentNode extends ActivityNode {
  get labelBounds(): Bounds {
    return { ...super.labelBounds, y: 0, height: this.bounds.height };
  }
}

export class EventNode extends CircularNode implements WithCustomIcon, SArgumentable, WithEditableLabel, Executable {
  static readonly DEFAULT_FEATURES = [
    connectableFeature,
    deletableFeature,
    selectFeature,
    boundsFeature,
    animateFeature,
    moveFeature,
    layoutContainerFeature,
    fadeFeature,
    hoverFeedbackFeature,
    popupFeature,
    openFeature,
    breakpointFeature,
    quickActionFeature,
    withEditLabelFeature,
    executionFeature,
    wrapFeature
  ];

  args: Args;
  executionCount?: number;

  get icon(): string {
    return this.args?.iconUri as string;
  }

  get customIcon(): string {
    return (this.args?.customIconUri as string) ?? this.icon;
  }

  get color(): string {
    return (this.args?.color as string) ?? '';
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
    return super.canConnect(routable, role) && (role === 'source' || this.typeOf(routable.sourceId) === ActivityTypes.COMMENT);
  }

  private typeOf(elementId: string): string | undefined {
    if (elementId) {
      return this.index.getById(elementId)?.type;
    }
    return undefined;
  }
}

export class GatewayNode extends DiamondNode implements WithCustomIcon, SArgumentable, WithEditableLabel, Executable {
  static readonly DEFAULT_FEATURES = [
    connectableFeature,
    deletableFeature,
    selectFeature,
    boundsFeature,
    animateFeature,
    moveFeature,
    layoutContainerFeature,
    fadeFeature,
    hoverFeedbackFeature,
    popupFeature,
    openFeature,
    breakpointFeature,
    quickActionFeature,
    withEditLabelFeature,
    executionFeature,
    wrapFeature,
    multipleOutgoingEdgesFeature
  ];

  args: Args;
  executionCount?: number;
  size = {
    width: 32,
    height: 32
  };

  get icon(): string {
    return this.args?.iconUri as string;
  }

  get customIcon(): string {
    return (this.args?.customIconUri as string) ?? this.icon;
  }

  get color(): string {
    return (this.args?.color as string) ?? '';
  }

  get editableLabel(): (SChildElement & EditableLabel) | undefined {
    return findEditableLabel(this, LabelType.DEFAULT);
  }
}

export class Edge extends SEdge implements WithEditableLabel, Executable, SArgumentable {
  static readonly DEFAULT_FEATURES = [
    editFeature,
    reconnectFeature,
    deletableFeature,
    selectFeature,
    fadeFeature,
    hoverFeedbackFeature,
    popupFeature,
    withEditLabelFeature,
    executionFeature,
    quickActionFeature
  ];

  args: Args;
  executionCount?: number;

  get color(): string {
    return this.args?.color as string;
  }

  get bounds(): Bounds {
    // this should also work for splines, which have the convex hull property
    return this.routingPoints.reduce<Bounds>(
      (bounds, routingPoint) =>
        Bounds.combine(bounds, {
          x: routingPoint.x,
          y: routingPoint.y,
          width: 0,
          height: 0
        }),
      this.centerBounds()
    );
  }

  private centerBounds(): Bounds {
    const sourcePoint: Point = Bounds.center(this.source?.bounds || Bounds.EMPTY);
    const targetPoint: Point = Bounds.center(this.target?.bounds || Bounds.EMPTY);
    return Bounds.translate(Bounds.EMPTY, centerOfLine(sourcePoint, targetPoint));
  }

  get editableLabel(): (SChildElement & EditableLabel) | undefined {
    return findEditableLabel(this, EdgeTypes.LABEL);
  }
}

export class MulitlineEditLabel extends SLabel implements EditableLabel {
  static readonly DEFAULT_FEATURES = [fadeFeature, editLabelFeature];
  readonly isMultiLine = true;

  get editControlDimension(): Dimension {
    return { width: Math.max(this.bounds.width + 25, 144), height: Math.max(this.bounds.height, 44) };
  }

  get editControlPositionCorrection(): Point {
    return { x: -2, y: -3 };
  }

  get labelBounds(): Bounds {
    const font = this.font();
    const lines = this.text.split('\n');
    const textWidth = Math.max(...lines.map(line => this.textWidth(line, font)));
    const textHeight = 14 * lines.length;
    return { x: -textWidth / 2, y: 0, width: textWidth, height: textHeight };
  }

  textWidth(text: string, font: string): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = font;
      const metrics = context.measureText(text);
      console.log(`${text} ${metrics.width}`);
      return metrics.width;
    }
    return this.bounds.width;
  }

  font(el = document.body): string {
    const fontWeight = this.cssStyle(el, 'font-weight');
    const fontSize = '14px';
    const fontFamily = this.cssStyle(el, 'font-family');
    return `${fontWeight} ${fontSize} ${fontFamily}`;
  }

  cssStyle(element: HTMLElement, prop: string): string {
    return window.getComputedStyle(element, undefined).getPropertyValue(prop);
  }
}

export class EdgeLabel extends MulitlineEditLabel {
  get labelBounds(): Bounds {
    return { ...super.labelBounds, y: -super.labelBounds.height / 2 };
  }
}

export class RotateLabel extends MulitlineEditLabel {
  get editControlDimension(): Dimension {
    return { width: Math.min(this.bounds.height + 25, 144), height: Math.max(this.bounds.width, 44) };
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
    return Point.ORIGIN;
  }

  get labelBounds(): Bounds {
    if (this.parent instanceof ActivityNode) {
      return this.parent.labelBounds;
    }
    return { x: -this.bounds.width / 2, y: 18, width: this.bounds.width, height: this.bounds.height - 18 };
  }
}

function findEditableLabel(element: SParentElement, type: string): (SChildElement & EditableLabel) | undefined {
  const label = element.children.find(e => e.type === type);
  if (label && isEditableLabel(label)) {
    return label;
  }
  return undefined;
}
