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
            cx={-10}
            cy={9}
            r={4}
          ></circle>
          {handle.globalDisabled && <line class-ivy-breakpoint-handle-globaldisable x1={-15} y1={14} x2={-5} y2={4} />}
        </g>
      );
    }
    return <g />;
  }
}
