import { useDialogCallPart } from './DialogCallPart';
import type { DeepPartial } from 'test-utils';
import { customRender, screen, TableUtil, customRenderHook, CollapsableUtil } from 'test-utils';
import type { CallData, DialogCallData, ElementData } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../../editors/part/usePart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useDialogCallPart();
  return <>{part.content}</>;
};

describe('DialogCallPart', () => {
  function renderPart(data?: CallData & DialogCallData) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  async function assertMainPart(dialog: string, map: RegExp[], code: string) {
    expect(await screen.findByRole('combobox')).toHaveValue(dialog);
    TableUtil.assertRows(map);
    expect(await screen.findByTestId('code-editor')).toHaveValue(code);
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Dialog');
    await CollapsableUtil.assertClosed('Mapping');
    await CollapsableUtil.assertClosed('Code');
  });

  test('full data', async () => {
    renderPart({ dialog: 'dialog', call: { code: 'code', map: { key: 'value' } } });
    await assertMainPart('dialog', [/key value/], 'code');
  });

  function assertState(expectedState: PartStateFlag, data?: Partial<CallData & DialogCallData>) {
    const { result } = customRenderHook(() => useDialogCallPart(), { wrapperProps: { data: data && { config: data } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { dialog: 'dialog' });
    assertState('configured', { call: { code: 'code', map: {} } });
    assertState('configured', { call: { code: '', map: { key: 'value' } } });
  });

  test('reset', () => {
    let data: DeepPartial<ElementData> = {
      config: { dialog: 'dialog', call: { code: 'code', map: { key: 'value' } } }
    };
    const view = customRenderHook(() => useDialogCallPart(), {
      wrapperProps: { data, setData: newData => (data = newData), initData: { config: { dialog: 'init' } } }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    expect(data.config?.dialog).toEqual('init');
    expect(data.config?.call?.code).toEqual('');
    expect(data.config?.call?.map).toEqual({});
  });
});
