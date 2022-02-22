import { svg } from '@eclipse-glsp/client';
import { VNode } from 'snabbdom';
import { Bounds } from 'sprotty';
import virtualize from 'sprotty/lib/lib/virtualize';

import { IconStyle, resolveIcon } from './icons';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

export function getActivityIconDecorator(iconUri: string): VNode {
  const svgBounds = { height: 14, width: 14, x: 2, y: 2 };
  const bounds = { height: 16, width: 20, x: 2, y: 2 };
  return iconDecorator(iconUri, bounds, svgBounds, false);
}

export function getIconDecorator(iconUri: string, radius: number): VNode {
  const svgBounds = { height: 14, width: 14, x: radius - 7, y: radius - 7 };
  const bounds = { height: 14, width: 18, x: radius - 8, y: radius - 7 };
  return iconDecorator(iconUri, bounds, svgBounds, true);
}

function iconDecorator(iconUri: string, bounds: Bounds, svgBounds: Bounds, smallIcon: boolean): VNode {
  const icon = resolveIcon(iconUri);
  if (icon.style === IconStyle.NO || icon.style === IconStyle.UNKNOWN) {
    return <g></g>;
  }
  if (icon.style === IconStyle.SVG) {
    return (
      <svg
        height={svgBounds.height}
        width={svgBounds.width}
        x={svgBounds.x}
        y={svgBounds.y}
        viewBox={'0 0 10 10'}
        class-sprotty-node-decorator={true}
      >
        <path fill={'none'} d={icon.res}></path>
      </svg>
    );
  }
  let foreignObjectContents;
  if (icon.style === IconStyle.FA) {
    foreignObjectContents = virtualize(`<i class="fa fa-fw ${icon.res}"></i>`);
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
