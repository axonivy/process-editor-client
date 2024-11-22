import { useSubCallPart } from './SubCallPart';
import type { DeepPartial } from 'test-utils';
import { render, screen, TableUtil, renderHook, CollapsableUtil } from 'test-utils';
import type { CallData, ElementData, ProcessCallData } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../../editors/part/usePart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useSubCallPart();
  return <>{part.content}</>;
};

describe('SubCallPart', () => {
  function renderPart(data?: CallData & ProcessCallData) {
    render(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  async function assertMainPart(dialog: string, map: RegExp[], code: string) {
    expect(await screen.findByRole('combobox')).toHaveValue(dialog);
    TableUtil.assertRows(map);
    expect(await screen.findByTestId('code-editor')).toHaveValue(code);
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Process start');
    await CollapsableUtil.assertClosed('Mapping');
    await CollapsableUtil.assertClosed('Code');
  });

  test('full data', async () => {
    renderPart({ processCall: 'process', call: { code: 'code', map: { key: 'value' } } });
    await assertMainPart('process', [/key value/], 'code');
  });

  function assertState(expectedState: PartStateFlag, data?: Partial<CallData & ProcessCallData>) {
    const { result } = renderHook(() => useSubCallPart(), { wrapperProps: { data: data && { config: data } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { processCall: 'dialog' });
    assertState('configured', { call: { code: 'code', map: {} } });
    assertState('configured', { call: { code: '', map: { key: 'value' } } });
  });

  test('reset', () => {
    let data: DeepPartial<ElementData> = {
      config: { processCall: 'process', call: { code: 'code', map: { key: 'value' } } }
    };
    const view = renderHook(() => useSubCallPart(), {
      wrapperProps: { data, setData: newData => (data = newData), initData: { config: { processCall: 'init' } } }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    expect(data.config?.processCall).toEqual('init');
    expect(data.config?.call?.code).toEqual('');
    expect(data.config?.call?.map).toEqual({});
  });
});
