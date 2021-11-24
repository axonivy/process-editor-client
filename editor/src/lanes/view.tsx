import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { IView, Point, RenderingContext, setAttr, svg } from 'sprotty';

import { isLaneResizable, LaneResizeHandleLocation, SLaneResizeHandle } from './model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class SLaneResizeHandleView implements IView {
  render(handle: SLaneResizeHandle, context: RenderingContext): VNode {
    const position = this.getPosition(handle);
    if (position !== undefined) {
      const node = (
        <svg
          class-lane-resize-handle={true}
          class-mouseover={handle.hoverFeedback}
          x={position.x - 20}
          y={position.y - 10}
          width={40}
          height={20}
        >
          <rect x={0} y={0} height={20} width={40} class-lane-resize-mouse-handle={true} />
          <line x1={0} y1={10} x2={40} y2={10} />;
        </svg>
      );
      setAttr(node, 'data-kind', handle.location);
      return node;
    }
    return <g />;
  }

  protected getPosition(handle: SLaneResizeHandle): Point | undefined {
    const parent = handle.parent;
    if (isLaneResizable(parent)) {
      const x = parent.bounds.width / 2;
      if (handle.location === LaneResizeHandleLocation.Top) {
        return { x: x, y: 5 };
      } else if (handle.location === LaneResizeHandleLocation.Bottom) {
        return { x: x, y: parent.bounds.height - 5 };
      }
    }
    return undefined;
  }
}
