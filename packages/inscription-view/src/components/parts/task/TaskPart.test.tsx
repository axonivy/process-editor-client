import type { DeepPartial } from 'test-utils';
import { renderHook, screen, render, cloneObject } from 'test-utils';
import type { WfTask, TaskData, ElementData } from '@axonivy/process-editor-inscription-protocol';
import { DEFAULT_TASK } from '@axonivy/process-editor-inscription-protocol';
import type { TaskPartProps } from './TaskPart';
import { useTaskPart } from './TaskPart';
import type { PartStateFlag } from '../../editors/part/usePart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useTaskPart();
  return <>{part.content}</>;
};

describe('TaskPart', () => {
  function renderEmptyPart() {
    render(<Part />, { wrapperProps: { defaultData: { task: undefined } } });
  }

  function assertState(
    expectedState: PartStateFlag,
    task?: DeepPartial<WfTask>,
    taskData?: Partial<TaskData>,
    type?: TaskPartProps['type']
  ) {
    const data = taskData ? { config: taskData } : task ? { config: { task } } : undefined;
    const { result } = renderHook(() => useTaskPart({ type }), { wrapperProps: { data } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('empty data', async () => {
    renderEmptyPart();
    expect(screen.getByText('There is no (Task) output flow connected.')).toBeInTheDocument();
  });

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { name: 'name' });
    assertState('configured', { description: 'desc' });
    assertState('configured', { category: 'cat' });
    assertState('configured', { responsible: { type: 'ROLE_FROM_ATTRIBUTE', activator: '' } });
    assertState('configured', { priority: { level: 'LOW', script: '' } });

    assertState('configured', { skipTasklist: true });
    assertState('configured', { notification: { suppress: true } });
    assertState('configured', { delay: 'delay' });
    assertState('configured', undefined, { persistOnStart: true }, 'request');

    assertState('configured', { expiry: { timeout: 'asf' } });

    assertState('configured', { customFields: [{ name: 'cf', type: 'NUMBER', value: '123' }] });
    assertState('configured', { code: 'code' });
  });

  test('reset', () => {
    let data: DeepPartial<ElementData> = {
      config: {
        task: {
          name: 'name',
          description: 'desc',
          category: 'cat',
          responsible: { type: 'ROLE_FROM_ATTRIBUTE', activator: '' },
          priority: { level: 'LOW', script: '' },
          skipTasklist: true,
          notification: { suppress: true },
          delay: 'delay',
          expiry: { timeout: 'asf' },
          customFields: [{ name: 'cf', type: 'NUMBER', value: '123' }],
          code: 'code'
        },
        persistOnStart: true
      }
    };
    const view = renderHook(() => useTaskPart(), {
      wrapperProps: { data, setData: newData => (data = newData), initData: { config: { task: { name: 'init' } } } }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    const expectedTask = cloneObject(DEFAULT_TASK);
    expectedTask.name = 'init';
    expect(data.config?.task).toEqual(expectedTask);
    expect(data.config?.persistOnStart).toEqual(false);
  });
});
