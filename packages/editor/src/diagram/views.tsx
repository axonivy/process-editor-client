import {
  angleOfPoint,
  EdgePadding,
  GEdgeView,
  hasArguments,
  IView,
  Point,
  PolylineEdgeViewWithGapsOnIntersections,
  RenderingContext,
  SEdge,
  svg,
  toDegrees
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import virtualize from 'sprotty/lib/lib/virtualize';
import { Edge, MulitlineEditLabel } from './model';
import { escapeHtmlWithLineBreaks } from './util';

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
        style={{ stroke: edge.color }}
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

  protected override renderAdditionals(edge: SEdge, segments: Point[], _context: RenderingContext): VNode[] {
    // for additional padding we draw another transparent path with larger stroke width
    if (hasArguments(edge) && edge.args) {
      const edgePadding = EdgePadding.from(edge);
      return edgePadding ? [this.renderMouseHandle(segments, edgePadding)] : [];
    }
    return [];
  }
}
