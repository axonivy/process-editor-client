import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, customRender, customRenderHook, screen } from 'test-utils';
import type { ElementData, ValidationResult, ProcessDataData } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useProcessDataPart } from './ProcessDataPart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useProcessDataPart();
  return <>{part.content}</>;
};

describe('ProcessDataPart', () => {
  function renderPart(data?: ProcessDataData) {
    customRender(<Part />, {
      wrapperProps: { data: data && { config: data } }
    });
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Data Class');
  });

  test('full data', async () => {
    renderPart({
      data: 'screenshot.project.Order'
    });
    expect(screen.getByRole('combobox')).toHaveValue('screenshot.project.Order');
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<ProcessDataData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useProcessDataPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', {
      data: 'screenshot.project.Order'
    });

    assertState('warning', undefined, { path: 'data.error', message: '', severity: 'WARNING' });
  });

  test('reset', () => {
    let data: DeepPartial<ElementData> = {
      config: {
        data: 'screenshot.project.Order'
      }
    };
    const view = customRenderHook(() => useProcessDataPart(), {
      wrapperProps: { data, setData: newData => (data = newData) }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    expect(data.config?.data).toEqual('');
  });
});
