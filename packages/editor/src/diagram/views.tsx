import {
  angleOfPoint,
  Bounds,
  Dimension,
  EdgePadding,
  GEdge,
  GEdgeView,
  GResizeHandle,
  GResizeHandleView,
  hasArgs,
  IntersectingRoutedPoint,
  IView,
  IViewArgs,
  Point,
  PolylineEdgeViewWithGapsOnIntersections,
  RenderingContext,
  SEdgeImpl,
  setAttr,
  svg,
  toDegrees
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import virtualize from 'sprotty/lib/lib/virtualize';
import { Edge, MulitlineEditLabel } from './model';
import { escapeHtmlWithLineBreaks } from './util';

import { isLaneResizable, LaneResizable } from '../lanes/model';
import { ActivityTypes } from './view-types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class ForeignLabelView implements IView {
  render(model: MulitlineEditLabel, context: RenderingContext): VNode {
    const replacement = escapeHtmlWithLineBreaks(model.text);
    const labelBounds = model.labelBounds;
    const foreignObjectContents = virtualize(`<div style="height: ${labelBounds.height}px;">${replacement}</div>`);
    return (
      <g>
        <foreignObject
          requiredFeatures='http://www.w3.org/TR/SVG11/feature#Extensibility'
          height={labelBounds.height}
          width={labelBounds.width}
          x={labelBounds.x}
          y={labelBounds.y}
          z={10}
          class-sprotty-label
          class-node-child-label={model.parent.type.startsWith(ActivityTypes.DEFAULT)}
        >
          {foreignObjectContents}
        </foreignObject>
        {context.renderChildren(model)}
      </g>
    );
  }
}

@injectable()
export class WorkflowEdgeView extends PolylineEdgeViewWithGapsOnIntersections {
  protected renderLine(edge: Edge, segments: Point[], context: RenderingContext): VNode {
    const line = super.renderLine(edge, segments, context, undefined);
    if (line.data) {
      line.data.style = { stroke: edge.color };
    }
    return line;
  }

  protected renderAdditionals(edge: Edge, segments: Point[], context: RenderingContext): VNode[] {
    const additionals = super.renderAdditionals(edge, segments, context);
    const edgePadding = this.edgePadding(edge);
    const edgePaddingNode = edgePadding ? [this.renderMouseHandle(segments, edgePadding)] : [];

    const p1 = segments[segments.length - 2];
    const p2 = segments[segments.length - 1];
    const arrow = (
      <path
        class-sprotty-edge={true}
        class-arrow={true}
        d='M 0.5,0 L 6,-3 L 6,3 Z'
        transform={`rotate(${toDegrees(angleOfPoint({ x: p1.x - p2.x, y: p1.y - p2.y }))} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}
        style={{ stroke: edge.color, fill: edge.color }}
      />
    );
    additionals.push(...edgePaddingNode, arrow);
    return additionals;
  }

  private edgePadding(edge: Edge) {
    if (edge.args) {
      return EdgePadding.from(edge);
    }
    return undefined;
  }

  protected renderMouseHandle(segments: Point[], padding: number): VNode {
    return (
      <path
        class-mouse-handle
        d={this.createPathForSegments(segments)}
        style-stroke-width={padding * 2}
        style-stroke='transparent'
        style-stroke-dasharray='none'
        style-stroke-dashoffset='0'
      />
    );
  }

  protected createPathForSegments(segments: Point[]): string {
    const firstPoint = segments[0];
    let path = `M ${firstPoint.x},${firstPoint.y}`;
    for (let i = 1; i < segments.length; i++) {
      const p = segments[i];
      path += ` L ${p.x},${p.y}`;
    }
    return path;
  }

  protected intersectionPath(edge: SEdgeImpl, segments: Point[], intersectingPoint: IntersectingRoutedPoint, args?: IViewArgs): string {
    try {
      return super.intersectionPath(edge, segments, intersectingPoint, args);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (ex) {
      // ingnore exception which can occur if one point of the segmet is NaN
      return '';
    }
  }
}

@injectable()
export class AssociationEdgeView extends GEdgeView {
  protected renderLine(edge: Edge, segments: Point[], context: RenderingContext): VNode {
    const line = super.renderLine(edge, segments, context);
    if (line.data) {
      line.data.style = { stroke: edge.color };
    }
    return line;
  }

  protected override renderAdditionals(edge: GEdge, segments: Point[], _context: RenderingContext): VNode[] {
    // for additional padding we draw another transparent path with larger stroke width
    if (hasArgs(edge) && edge.args) {
      const edgePadding = EdgePadding.from(edge);
      return edgePadding ? [this.renderMouseHandle(segments, edgePadding)] : [];
    }
    return [];
  }
}

@injectable()
export class IvyResizeHandleView extends GResizeHandleView {
  render(handle: GResizeHandle, context: RenderingContext): VNode | undefined {
    if (context.targetKind === 'hidden') {
      return undefined;
    }
    const element = handle.parent;
    if (!isLaneResizable(element)) {
      return super.render(handle, context);
    }

    const position = this.getLaneHandlePosition(handle, element);
    if (position !== undefined) {
      return this.renderLandeResizeHandle(handle, position);
    }
    return <g />;
  }

  protected renderLandeResizeHandle(handle: GResizeHandle, position: Point) {
    const node = (
      <svg
        class-lane-resize-handle={true}
        class-mouseover={handle.hoverFeedback}
        x={position.x - 20}
        y={position.y - 10}
        width={40}
        height={20}
      >
        <rect x={0} y={0} height={20} width={40} class-lane-resize-mouse-handle={true} />
        <line x1={0} y1={10} x2={40} y2={10} />;
      </svg>
    );
    setAttr(node, 'data-kind', handle.location);
    return node;
  }

  protected getLaneHandlePosition(handle: GResizeHandle, element: LaneResizable): Point | undefined {
    if (handle.isNResize()) {
      return { x: Dimension.center(element.bounds).x, y: 5 };
    } else if (handle.isSResize()) {
      return { x: Dimension.center(element.bounds).x, y: Bounds.dimension(element.bounds).height - 5 };
    }
    return super.getPosition(handle);
  }
}
