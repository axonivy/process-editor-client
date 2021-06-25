import { Diamond, DiamondNodeView, Point, RenderingContext, SShapeElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import * as snabbdom from 'snabbdom-jsx';
import { VNode } from 'snabbdom/vnode';

import { GatewayNode } from './model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: snabbdom.svg };

@injectable()
export class GatewayNodeView extends DiamondNodeView {
  render(node: GatewayNode, context: RenderingContext): VNode {
    const diamond = new Diamond({ height: Math.max(node.size.height, 0), width: Math.max(node.size.width, 0), x: 0, y: 0 });
    const points = `${this.svgStr(diamond.topPoint)} ${this.svgStr(diamond.rightPoint)} ${this.svgStr(diamond.bottomPoint)} ${this.svgStr(diamond.leftPoint)}`;
    return <g>
      <polygon class-sprotty-node={true} class-animate={node.animated}
        class-mouseover={node.hoverFeedback} class-selected={node.selected}
        points={points} />
      {this.getDecorator(node)}
      {context.renderChildren(node)}
    </g>;
  }

  protected getDecorator(node: GatewayNode): VNode {
    const radius = this.getRadius(node);
    const startCoordinate = radius / 1.5;
    const endCoordinate = node.size.height - startCoordinate;
    return <g>
      <line class-sprotty-node-decorator x1={radius} y1={startCoordinate} x2={radius} y2={endCoordinate} />
      <line class-sprotty-node-decorator x1={startCoordinate} y1={radius} x2={endCoordinate} y2={radius} />
    </g>;
  }

  protected getRadius(node: SShapeElement): number {
    const d = Math.min(node.size.width, node.size.height);
    return d > 0 ? d / 2 : 0;
  }

  protected svgStr(point: Point): string {
    return `${point.x},${point.y}`;
  }
}

@injectable()
export class TaskGatewayNodeView extends GatewayNodeView {
  protected getDecorator(node: GatewayNode): VNode {
    const radius = this.getRadius(node);
    const startCoordinate = radius / 1.5;
    const endCoordinate = node.size.height - startCoordinate;
    return <g>
      <circle class-sprotty-node={true} class-sprotty-task-node={true}
        r={radius / 2} cx={radius} cy={radius}>
      </circle>
      <line class-sprotty-node-decorator x1={radius} y1={startCoordinate} x2={radius} y2={endCoordinate} />
      <line class-sprotty-node-decorator x1={startCoordinate} y1={radius} x2={endCoordinate} y2={radius} />
    </g>;
  }
}

@injectable()
export class AlternateGatewayNodeView extends TaskGatewayNodeView {
  protected getDecorator(node: GatewayNode): VNode {
    const startCoordinate = node.size.height / 3;
    const endCoordinate = node.size.height - startCoordinate;
    return <g>
      <line class-sprotty-node-decorator x1={startCoordinate} y1={startCoordinate} x2={endCoordinate} y2={endCoordinate} />
      <line class-sprotty-node-decorator x1={startCoordinate} y1={endCoordinate} x2={endCoordinate} y2={startCoordinate} />
    </g>;
  }
}
