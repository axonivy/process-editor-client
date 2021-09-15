import { CircularNodeView, RenderingContext } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import * as snabbdom from 'snabbdom-jsx';
import { VNode } from 'snabbdom/vnode';

import { IconStyle } from '../icons';
import { EventNode } from '../model';

const virtualize = require('snabbdom-virtualize/strings').default;

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
      {this.getIconDecorator(node)}
      {context.renderChildren(node)}
    </g>;
  }

  protected getEventDecorator(radius: number): VNode {
    return <g></g>;
  }

  protected getIconDecorator(node: EventNode): VNode {
    const icon = node.icon;
    if (icon.style === IconStyle.NO) {
      return <g></g>;
    }
    if (icon.style === IconStyle.SVG) {
      return <svg height={14} width={14} x={8} y={8} viewBox={'0 0 10 10'}
        class-sprotty-node-decorator={true}>
        <path fill={'none'} d={icon.res}></path>
      </svg>;
    }
    let foreignObjectContents;
    if (icon.style === IconStyle.FA) {
      foreignObjectContents = virtualize(`<i class="fa fa-fw ${icon.res}"></i>`);
    } else {
      foreignObjectContents = virtualize(`<img src="${icon.res}"></i>`);
    }
    return <g>
      <foreignObject requiredFeatures='http://www.w3.org/TR/SVG11/feature#Extensibility'
        height={14} width={18} x={7} y={8}
        class-sprotty-icon class-icon-small>
        {foreignObjectContents}
      </foreignObject>
    </g>;
  }
}

@injectable()
export class IntermediateEventNodeView extends EventNodeView {
  protected getEventDecorator(radius: number): VNode {
    return <circle class-sprotty-node={true} class-sprotty-task-node={true}
      r={radius - 3} cx={radius} cy={radius}></circle>;
  }
}
