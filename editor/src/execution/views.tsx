import { svg } from '@eclipse-glsp/client';
import { VNode } from 'snabbdom';
import { Executable } from './model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

export function createExecutionBadge(node: Executable, width: number): VNode {
  if (node.executionCount) {
    return (
      <g>
        <rect class-execution-badge={true} rx='7' ry='7' x={width - 11} y={-7} width={22} height={14}></rect>
        <text class-execution-text={true} x={width} dy='.4em'>
          {node.executionCount}
        </text>
      </g>
    );
  }
  return <g></g>;
}
