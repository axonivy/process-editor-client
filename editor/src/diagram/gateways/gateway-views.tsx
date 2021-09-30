import { Diamond, DiamondNodeView, Point, RenderingContext, SShapeElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import * as snabbdom from 'snabbdom-jsx';
import { VNode } from 'snabbdom/vnode';

import { getIconDecorator } from '../icon/views';
import { GatewayNode } from '../model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: snabbdom.svg };

@injectable()
export class GatewayNodeView extends DiamondNodeView {
  render(node: GatewayNode, context: RenderingContext): VNode {
    const diamond = new Diamond({ height: Math.max(node.size.height, 0), width: Math.max(node.size.width, 0), x: 0, y: 0 });
    const points = `${this.svgStr(diamond.topPoint)} ${this.svgStr(diamond.rightPoint)} ${this.svgStr(diamond.bottomPoint)} ${this.svgStr(diamond.leftPoint)}`;
    const radius = this.getRadius(node);
    return <g>
      <polygon class-sprotty-node={true} class-animate={node.animated}
        class-mouseover={node.hoverFeedback} class-selected={node.selected}
        points={points} />
      {getIconDecorator(node.icon, radius)}
      {context.renderChildren(node)}
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
