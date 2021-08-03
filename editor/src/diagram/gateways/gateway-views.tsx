import { Diamond, DiamondNodeView, Point, RenderingContext, SShapeElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import * as snabbdom from 'snabbdom-jsx';
import { VNode } from 'snabbdom/vnode';

import { GatewayNode } from '../model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: snabbdom.svg };

@injectable()
export class GatewayNodeView extends DiamondNodeView {
  render(node: GatewayNode, context: RenderingContext): VNode {
    const diamond = new Diamond({ height: Math.max(node.size.height, 0), width: Math.max(node.size.width, 0), x: 0, y: 0 });
    const points = `${this.svgStr(diamond.topPoint)} ${this.svgStr(diamond.rightPoint)} ${this.svgStr(diamond.bottomPoint)} ${this.svgStr(diamond.leftPoint)}`;
    const radius = this.getRadius(node);
    const lesserThird = this.getLesserThird(node);
    const biggerThird = this.getBiggerThird(node);
    return <g>
      <polygon class-sprotty-node={true} class-animate={node.animated}
        class-mouseover={node.hoverFeedback} class-selected={node.selected}
        points={points} />
      {this.getDecorator(radius, lesserThird, biggerThird)}
      {context.renderChildren(node)}
    </g>;
  }

  protected getDecorator(radius: number, lesserThird: number, biggerThird: number): VNode {
    return <g>
      <line class-sprotty-node-decorator x1={radius} y1={lesserThird} x2={radius} y2={biggerThird} />
      <line class-sprotty-node-decorator x1={lesserThird} y1={radius} x2={biggerThird} y2={radius} />
    </g>;
  }

  protected getRadius(node: SShapeElement): number {
    const d = Math.min(node.size.width, node.size.height);
    return d > 0 ? d / 2 : 0;
  }

  protected getLesserThird(node: SShapeElement): number {
    return Math.round(node.size.height / 3);
  }

  protected getBiggerThird(node: SShapeElement): number {
    const height = node.size.height;
    return Math.round(height - (height / 3));
  }

  protected svgStr(point: Point): string {
    return `${point.x},${point.y}`;
  }
}

@injectable()
export class TaskGatewayNodeView extends GatewayNodeView {
  protected getDecorator(radius: number, lesserThird: number, biggerThird: number): VNode {
    return <g>
      <circle class-sprotty-node={true} class-sprotty-task-node={true}
        r={radius / 2} cx={radius} cy={radius}>
      </circle>
      <line class-sprotty-node-decorator x1={radius} y1={lesserThird} x2={radius} y2={biggerThird} />
      <line class-sprotty-node-decorator x1={lesserThird} y1={radius} x2={biggerThird} y2={radius} />
    </g>;
  }
}

@injectable()
export class AlternateGatewayNodeView extends TaskGatewayNodeView {
  protected getDecorator(radius: number, lesserThird: number, biggerThird: number): VNode {
    return <g>
      <line class-sprotty-node-decorator x1={lesserThird} y1={lesserThird} x2={biggerThird} y2={biggerThird} />
      <line class-sprotty-node-decorator x1={lesserThird} y1={biggerThird} x2={biggerThird} y2={lesserThird} />
    </g>;
  }
}
