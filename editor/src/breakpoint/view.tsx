import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { isBoundsAware, IView, RenderingContext, svg } from '@eclipse-glsp/client';

import { SBreakpointHandle } from './model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class SBreakpointHandleView implements IView {
  render(handle: SBreakpointHandle, context: RenderingContext): VNode {
    if (isBoundsAware(handle.parent)) {
      return (
        <g>
          <circle
            class-ivy-breakpoint-handle={true}
            class-disabled={handle.disabled}
            class-condition={handle.condition?.length > 0 && handle.condition !== 'true'}
            class-mouseover={handle.hoverFeedback}
            cx={-7}
            cy={7}
            r={5}
          ></circle>
          {handle.globalDisabled && <line class-ivy-breakpoint-handle-globaldisable x1={-12} y1={2} x2={-2} y2={12} />}
        </g>
      );
    }
    return <g />;
  }
}
