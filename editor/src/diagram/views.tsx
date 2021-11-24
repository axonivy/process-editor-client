import {
  angleOfPoint,
  GEdgeView,
  IView,
  Point,
  RenderingContext,
  SEdge,
  SLabel,
  svg,
  toDegrees
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import virtualize from 'sprotty/lib/lib/virtualize';

import { ActivityTypes } from './view-types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class ForeignLabelView implements IView {
  render(model: SLabel, context: RenderingContext): VNode {
    const replacement = model.text.replace(/\n/g, '<br/>');
    const foreignObjectContents = virtualize(`<div>${replacement}</div>`);
    const node = <g>
      <foreignObject requiredFeatures='http://www.w3.org/TR/SVG11/feature#Extensibility'
        height={model.bounds.height} width={model.bounds.width} x={0} y={0} z={10}
        class-sprotty-label
        class-node-child-label={model.parent.type.startsWith(ActivityTypes.DEFAULT)}>
        {foreignObjectContents}
      </foreignObject>
      {context.renderChildren(model)}
    </g>;
    return node;
  }
}

@injectable()
export class WorkflowEdgeView extends GEdgeView {
  protected renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
    const additionals = super.renderAdditionals(edge, segments, context);
    const p1 = segments[segments.length - 2];
    const p2 = segments[segments.length - 1];
    const arrow = <path class-sprotty-edge={true} class-arrow={true} d='M 1.5,0 L 10,-4 L 10,4 Z'
      transform={`rotate(${toDegrees(angleOfPoint({ x: p1.x - p2.x, y: p1.y - p2.y }))} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`} />;
    additionals.push(arrow);
    return additionals;
  }
}
