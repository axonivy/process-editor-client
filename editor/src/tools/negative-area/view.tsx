import { injectable } from 'inversify';
import type { VNode } from 'snabbdom';
import { type IView, type RenderingContext, svg } from '@eclipse-glsp/client';

import { NegativeMarker } from './model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class SNegativeMarkerView implements IView {
  render(marker: NegativeMarker, context: RenderingContext): VNode {
    const node = (
      <g>
        <rect
          x={marker.modelBounds.x}
          y={marker.modelBounds.y}
          width={marker.modelBounds.width}
          height={-marker.modelBounds.y}
          class-negative-area
        />
        <rect x={marker.modelBounds.x} y={0} width={-marker.modelBounds.x} height={marker.modelBounds.height} class-negative-area />
      </g>
    );
    return node;
  }
}
