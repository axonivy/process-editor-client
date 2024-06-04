import { CircularNodeView, RenderingContext, hiddenBoundingRect, svg } from '@eclipse-glsp/client';
import { inject, injectable, optional } from 'inversify';
import { VNode } from 'snabbdom';
import { createExecutionBadge } from '../../execution/views';

import { CustomIconToggleActionHandler } from '../../ui-tools/tool-bar/options/action-handler';
import { getIconDecorator } from '../icon/views';
import { EventNode } from '../model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class EventNodeView extends CircularNodeView {
  @inject(CustomIconToggleActionHandler) @optional() protected customIconHandler?: CustomIconToggleActionHandler;

  render(node: EventNode, context: RenderingContext): VNode {
    const radius = this.getRadius(node);
    return (
      <g>
        {hiddenBoundingRect(node, context)}
        <circle
          class-sprotty-node={true}
          class-mouseover={node.hoverFeedback}
          class-selected={node.selected}
          r={radius}
          cx={radius}
          cy={radius}
          style={{ stroke: node.color }}
        ></circle>
        {this.getEventDecorator(radius)}
        {getIconDecorator(this.customIconHandler?.isShowCustomIcons ? node.customIcon : node.type, radius, node.color)}
        {context.renderChildren(node)}
        {createExecutionBadge(node, 2 * radius)}
      </g>
    );
  }

  protected getEventDecorator(radius: number): VNode {
    return <g></g>;
  }
}

@injectable()
export class IntermediateEventNodeView extends EventNodeView {
  protected getEventDecorator(radius: number): VNode {
    return <circle class-sprotty-node={true} class-sprotty-task-node={true} r={radius - 3} cx={radius} cy={radius}></circle>;
  }
}
