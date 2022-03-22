import {
  angleOfPoint,
  EdgePadding,
  GEdgeView,
  IView,
  Point,
  PolylineEdgeViewWithGapsOnIntersections,
  RenderingContext,
  SLabel,
  svg,
  toDegrees
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import virtualize from 'sprotty/lib/lib/virtualize';
import { Edge } from './model';
import { escapeHtmlWithLineBreaks } from './util';

import { ActivityTypes } from './view-types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class ForeignLabelView implements IView {
  render(model: SLabel, context: RenderingContext): VNode {
    const replacement = escapeHtmlWithLineBreaks(model.text);
    const foreignObjectContents = virtualize(`<div>${replacement}</div>`);
    const node = (
      <g>
        <foreignObject
          requiredFeatures='http://www.w3.org/TR/SVG11/feature#Extensibility'
          height={model.bounds.height}
          width={model.bounds.width}
          x={0}
          y={0}
          z={10}
          class-sprotty-label
          class-node-child-label={model.parent.type.startsWith(ActivityTypes.DEFAULT)}
        >
          {foreignObjectContents}
        </foreignObject>
        {context.renderChildren(model)}
      </g>
    );
    return node;
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
    const edgePadding = EdgePadding.from(edge);
    const edgePaddingNode = edgePadding ? [this.renderMouseHandle(segments, edgePadding)] : [];

    const p1 = segments[segments.length - 2];
    const p2 = segments[segments.length - 1];
    const arrow = (
      <path
        class-sprotty-edge={true}
        class-arrow={true}
        d='M 1.5,0 L 10,-4 L 10,4 Z'
        transform={`rotate(${toDegrees(angleOfPoint({ x: p1.x - p2.x, y: p1.y - p2.y }))} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}
        style={{ stroke: edge.color }}
      />
    );
    additionals.push(...edgePaddingNode, arrow);
    return additionals;
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
}
