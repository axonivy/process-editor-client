import { svg, Bounds } from '@eclipse-glsp/client';
import { VNode } from 'snabbdom';
import virtualize from 'sprotty/lib/lib/virtualize';

import { IconStyle, resolveIcon } from './icons';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

export function getActivityIconDecorator(iconUri: string, color: string): VNode {
  const svgBounds = { height: 14, width: 14, x: 2, y: 2 };
  const bounds = { height: 12, width: 14, x: 4, y: 3 };
  return iconDecorator(iconUri, bounds, svgBounds, false, color);
}

export function getIconDecorator(iconUri: string, radius: number, color: string): VNode {
  const svgBounds = { height: 14, width: 14, x: radius - 7, y: radius - 7 };
  const bounds = { height: 14, width: 18, x: radius - 8, y: radius - 7 };
  return iconDecorator(iconUri, bounds, svgBounds, true, color);
}

function iconDecorator(iconUri: string, bounds: Bounds, svgBounds: Bounds, smallIcon: boolean, color: string): VNode {
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
        <path style={{ stroke: color }} d={icon.res}></path>
      </svg>
    );
  }
  let foreignObjectContents;
  if (icon.style === IconStyle.FA) {
    foreignObjectContents = virtualize(`<i class="${icon.res} fa-fw" style="color: ${color}"></i>`);
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
