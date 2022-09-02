import { svg, Bounds } from '@eclipse-glsp/client';
import { VNode } from 'snabbdom';
import virtualize from 'sprotty/lib/lib/virtualize';

import { IconStyle, resolveIcon } from './icons';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

export function getActivityIconDecorator(iconUri: string, color: string): VNode {
  const bounds = { height: 13, width: 14, x: 4, y: 3 };
  return iconDecorator(iconUri, bounds, false, color);
}

export function getIconDecorator(iconUri: string, radius: number, color: string): VNode {
  const bounds = { height: 14, width: 18, x: radius - 8, y: radius - 7 };
  return iconDecorator(iconUri, bounds, true, color);
}

function iconDecorator(iconUri: string, bounds: Bounds, smallIcon: boolean, color: string): VNode {
  const icon = resolveIcon(iconUri);
  if (icon.style === IconStyle.NO) {
    return <g></g>;
  }
  let foreignObjectContents;
  if (icon.style === IconStyle.SI) {
    foreignObjectContents = virtualize(`<i class="si si-${icon.res}" style="color: ${color}"></i>`);
  } else {
    foreignObjectContents = virtualize(`<img src="${icon.res}"></img>`);
  }
  return (
    <g>
      <foreignObject
        requiredFeatures='http://www.w3.org/TR/SVG11/feature#Extensibility'
        height={bounds.height}
        width={bounds.width}
        x={bounds.x}
        y={bounds.y}
        class-sprotty-icon
        class-icon-small={smallIcon}
      >
        {foreignObjectContents}
      </foreignObject>
    </g>
  );
}
