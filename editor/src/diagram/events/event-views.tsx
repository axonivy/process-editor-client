import { CircularNodeView, RenderingContext } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import * as snabbdom from 'snabbdom-jsx';
import { VNode } from 'snabbdom/vnode';

import { getIconDecorator } from '../icon/views';
import { EventNode } from '../model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: snabbdom.svg };

@injectable()
export class EventNodeView extends CircularNodeView {
  render(node: EventNode, context: RenderingContext): VNode {
    const radius = this.getRadius(node);
    return <g>
      <circle class-sprotty-node={true} class-animate={node.animated}
        class-mouseover={node.hoverFeedback} class-selected={node.selected}
        r={radius} cx={radius} cy={radius}></circle>
      {this.getEventDecorator(radius)}
      {getIconDecorator(node.icon, radius)}
      {context.renderChildren(node)}
    </g>;
  }

  protected getEventDecorator(radius: number): VNode {
    return <g></g>;
  }
}

@injectable()
export class IntermediateEventNodeView extends EventNodeView {
  protected getEventDecorator(radius: number): VNode {
    return <circle class-sprotty-node={true} class-sprotty-task-node={true}
      r={radius - 3} cx={radius} cy={radius}></circle>;
  }
}
