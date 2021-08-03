import { CircularNodeView, RenderingContext } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import * as snabbdom from 'snabbdom-jsx';
import { VNode } from 'snabbdom/vnode';

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
      {this.getTaskDecorator(radius)}
      {this.getDecorator()}
      {this.getIconDecorator()}
      {context.renderChildren(node)}
    </g>;
  }

  protected getTaskDecorator(radius: number): VNode {
    return <g></g>;
  }

  private getDecorator(): VNode {
    const decoratorPath = this.getDecoratorPath();
    if (decoratorPath && decoratorPath !== '') {
      return <svg height={14} width={14} x={8} y={8} viewBox={'0 0 10 10'}
        class-sprotty-node-decorator={true}>
        <path fill={'none'} d={decoratorPath}></path>
      </svg>;
    }
    return <g></g>;
  }

  protected getDecoratorPath(): string {
    return '';
  }

  protected getIconDecorator(): VNode {
    const icon = this.getIcon();
    if (!icon) {
      return <g></g>;
    }
    const foreignObjectContents = virtualize(`<i class="fa ${icon}"></i>`);
    return <g>
      <foreignObject requiredFeatures='http://www.w3.org/TR/SVG11/feature#Extensibility'
        height={14} width={18} x={7} y={8}
        class-sprotty-icon-small>
        {foreignObjectContents}
      </foreignObject>
    </g>;
  }

  protected getIcon(): string | undefined {
    return undefined;
  }
}

@injectable()
export class IntermediateEventNodeView extends EventNodeView {
  protected getTaskDecorator(radius: number): VNode {
    return <circle class-sprotty-node={true} class-sprotty-task-node={true}
      r={radius - 3} cx={radius} cy={radius}></circle>;
  }
}

@injectable()
export class ProgramEventNodeView extends EventNodeView {
  protected getIcon(): string {
    return 'fa-scroll';
  }
}

@injectable()
export class IntermediateTaskEventNodeView extends IntermediateEventNodeView {
  protected getIcon(): string | undefined {
    return 'fa-desktop';
  }
}

@injectable()
export class IntermediateWaitEventNodeView extends IntermediateEventNodeView {
  protected getIcon(): string | undefined {
    return 'fa-scroll';
  }
}

@injectable()
export class EndPageEventNodeView extends EventNodeView {
  protected getIcon(): string {
    return 'fa-desktop';
  }
}

@injectable()
export class SignalEventNodeView extends EventNodeView {
  protected getDecoratorPath(): string {
    return 'M5,0 L10,10 l-10,0 Z';
  }
}

@injectable()
export class BoundarySignalEventNodeView extends IntermediateEventNodeView {
  protected getDecoratorPath(): string {
    return 'M5,0 L10,10 l-10,0 Z';
  }
}

@injectable()
export class ErrorEventNodeView extends EventNodeView {
  protected getDecoratorPath(): string {
    return 'M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z';
  }
}

@injectable()
export class BoundaryErrorEventNodeView extends IntermediateEventNodeView {
  protected getDecoratorPath(): string {
    return 'M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z';
  }
}
