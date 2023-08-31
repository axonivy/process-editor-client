import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { IView, RenderingContext, svg } from '@eclipse-glsp/client';

import { NegativeMarker } from './model';

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
