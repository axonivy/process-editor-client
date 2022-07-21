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
      const parentHeight = handle.parent.bounds.height;
      return (
        <g>
          <rect
            class-ivy-breakpoint-handle={true}
            class-disabled={handle.disabled}
            class-condition={handle.condition?.length > 0 && handle.condition !== 'true'}
            class-mouseover={handle.hoverFeedback}
            x={-20}
            y={parentHeight - 13}
            rx={4}
            ry={4}
            width={12}
            height={8}
          ></rect>
          {handle.globalDisabled && (
            <line class-ivy-breakpoint-handle-globaldisable x1={-19} y1={parentHeight - 4} x2={-9} y2={parentHeight - 14} />
          )}
        </g>
      );
    }
    return <g />;
  }
}
