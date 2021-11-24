import { CircularNodeView, RenderingContext, svg } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { VNode } from 'snabbdom';

import { CustomIconToggleActionHandler } from '../icon/custom-icon-toggle-action-handler';
import { getIconDecorator } from '../icon/views';
import { EventNode } from '../model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class EventNodeView extends CircularNodeView {
  @inject(CustomIconToggleActionHandler) protected customIconHandler: CustomIconToggleActionHandler;

  render(node: EventNode, context: RenderingContext): VNode {
    const radius = this.getRadius(node);
    return (
      <g>
        <circle
          class-sprotty-node={true}
          class-animate={node.animated}
          class-mouseover={node.hoverFeedback}
          class-selected={node.selected}
          r={radius}
          cx={radius}
          cy={radius}
        ></circle>
        {this.getEventDecorator(radius)}
        {getIconDecorator(this.customIconHandler.isShowCustomIcons ? node.customIcon : node.icon, radius)}
        {context.renderChildren(node)}
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
