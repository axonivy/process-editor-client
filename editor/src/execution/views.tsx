import { svg } from '@eclipse-glsp/client';
import { VNode } from 'snabbdom';
import { Executable } from './model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

export function createExecutionBadge(node: Executable, width: number): VNode {
  if (node.executionCount) {
    return (
      <g>
        <rect class-execution-badge={true} rx='6' ry='6' x={width - 11} y={-6} width={22} height={12}></rect>
        <text class-execution-text={true} x={width} dy='.3em'>
          {node.executionCount}
        </text>
      </g>
    );
  }
  return <g></g>;
}
