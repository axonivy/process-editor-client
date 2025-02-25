import { GArgument, hasArguments, RectangularNodeView, type RenderingContext, SLabel, SLabelView, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import type { VNode } from 'snabbdom';

import { LaneNode } from '../model';

 
const JSX = { createElement: svg };

@injectable()
export class LaneNodeView extends RectangularNodeView {
  render(node: LaneNode, context: RenderingContext): VNode {
    if (this.isEmbeddedLane(node)) {
      const topRightRadius = node.isFirstChild() ? 4 : 0;
      const bottomRightRadius = node.isLastChild() ? 4 : 0;
      const path = `M0,0
      h${Math.max(node.size.width - topRightRadius, 0)}
      q${topRightRadius},0 ${topRightRadius},${topRightRadius}
      v${Math.max(node.size.height - 1 - topRightRadius - bottomRightRadius, 0)}
      q0,${bottomRightRadius} -${bottomRightRadius},${bottomRightRadius}
      h-${Math.max(node.size.width - bottomRightRadius, 0)}
      z`;
      return (
        <g>
          <path
            class-sprotty-node={true}
            class-selected={node.selected}
            d={path}
            {...(node.color ? { style: { stroke: node.color } } : {})}
          ></path>
          {this.colorDot(node)}
          {context.renderChildren(node)}
        </g>
      );
    }
    return (
      <g>
        <rect
          class-sprotty-node={true}
          class-selected={node.selected}
          x='0'
          y='0'
          rx='4px'
          ry='4px'
          width={Math.max(node.size.width, 0)}
          height={Math.max(node.size.height - 1, 0)}
          {...(node.color ? { style: { stroke: node.color } } : {})}
        ></rect>
        {this.getDecoratorLine(node)}
        {this.colorDot(node)}
        {context.renderChildren(node)}
      </g>
    );
  }

  private isEmbeddedLane(node: LaneNode): boolean {
    return node.parent instanceof LaneNode;
  }

  protected getDecoratorLine(node: LaneNode): VNode {
    return <g></g>;
  }

  protected colorDot(node: LaneNode): VNode {
    if (node.color) {
      return <circle r={6} cx={12} cy={Math.max(node.size.height - 13, 0)} style={{ fill: node.color }}></circle>;
    }
    return <g></g>;
  }
}

@injectable()
export class PoolNodeView extends LaneNodeView {
  protected getDecoratorLine(node: LaneNode): VNode {
    const poolLaneSpace = this.getPoolLaneSpace(node);
    const nodeHeight = node.size.height - 1;
    const path = `M${poolLaneSpace},0 v${nodeHeight} h-${poolLaneSpace - 4} q-4,0 -4,-4 v-${nodeHeight - 8} q0,-4 4,-4 z`;
    return (
      <path class-sprotty-node={true} class-pool-label-rect d={path} {...(node.color ? { style: { stroke: node.color } } : {})}></path>
    );
  }

  private getPoolLaneSpace(node: LaneNode): number {
    let poolLaneSpace = 24;
    if (hasArguments(node) && node.args) {
      poolLaneSpace = GArgument.getNumber(node, 'poolLabelSpace') ?? 24;
    }
    return poolLaneSpace - 1;
  }
}

@injectable()
export class RotateLabelView extends SLabelView {
  render(label: Readonly<SLabel>, context: RenderingContext): VNode | undefined {
    const rotate = `rotate(270) translate(-${label.bounds.height / 2} ${label.bounds.width / 2})`;
    return (
      <text class-sprotty-label={true} transform={rotate}>
        {label.text.split('\n').map((line, index) => (
          <tspan dy={index === 0 ? 0 : '1.2em'} x={0} style={line ? {} : { visibility: 'hidden' }}>
            {line ? line : '.'}
          </tspan>
        ))}
      </text>
    );
  }
}
