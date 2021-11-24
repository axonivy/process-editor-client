import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { isBoundsAware, IView, RenderingContext, svg } from 'sprotty';

import { SBreakpointHandle } from './model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class SBreakpointHandleView implements IView {
  render(handle: SBreakpointHandle, context: RenderingContext): VNode {
    if (isBoundsAware(handle.parent)) {
      return <g>
        <circle class-ivy-breakpoint-handle={true} class-mouseover={handle.hoverFeedback}
          cx={this.getRadius() * -1} cy={0} r={this.getRadius()}></circle>
      </g>;
    }
    return <g />;
  }

  getRadius(): number {
    return 7;
  }
}
