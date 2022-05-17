import { svg } from '@eclipse-glsp/client';
import { VNode } from 'snabbdom';
import { Executable } from './model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

export function createExecutionBadge(node: Executable, width: number): VNode {
  if (node.executionCount) {
    return (
      <g>
        <circle class-execution-badge={true} r='8' cx={width}></circle>
        <text class-execution-text={true} x={width} dy='.3em'>
          {node.executionCount}
        </text>
      </g>
    );
  }
  return <g></g>;
}
