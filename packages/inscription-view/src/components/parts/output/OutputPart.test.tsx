import type { DeepPartial } from 'test-utils';
import { render, screen, TableUtil, renderHook, CollapsableUtil } from 'test-utils';
import { useOutputPart } from './OutputPart';
import type { PartStateFlag } from '../../editors/part/usePart';
import type { ElementData, OutputData } from '@axonivy/process-editor-inscription-protocol';
import { describe, test, expect } from 'vitest';

const Part = (props: { showSudo?: boolean }) => {
  const part = useOutputPart({ showSudo: props.showSudo });
  return <>{part.content}</>;
};

describe('OutputPart', () => {
  function renderPart(data?: Partial<OutputData>, showSudo?: boolean) {
    render(<Part showSudo={showSudo} />, { wrapperProps: { data: data && { config: data } } });
  }

  async function assertMainPart(map: RegExp[], code: string) {
    TableUtil.assertRows(map);
    expect(await screen.findByTestId('code-editor')).toHaveValue(code);
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Mapping');
    await CollapsableUtil.assertClosed('Code');
  });

  test('full data', async () => {
    const data: Partial<OutputData> = { output: { map: { key: 'value' }, code: 'code' } };
    renderPart(data);
    await assertMainPart([/key value/], 'code');
  });

  test('enable Sudo', async () => {
    renderPart({ sudo: true }, true);
    await screen.findByLabelText(/Disable Permission/);
  });

  function assertState(expectedState: PartStateFlag, data?: Partial<OutputData>, showSudo?: boolean) {
    const { result } = renderHook(() => useOutputPart({ showSudo }), { wrapperProps: { data: data && { config: data } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState(undefined, { sudo: false });
    assertState('configured', { output: { code: '', map: {} }, sudo: true });
    assertState('configured', { output: { code: 'code', map: {} } });
    assertState('configured', { output: { code: '', map: { key: 'value' } } });
  });

  test('reset', () => {
    let data: DeepPartial<ElementData> = {
      config: { output: { map: { key: 'value' }, code: 'code' } }
    };
    const view = renderHook(() => useOutputPart(), {
      wrapperProps: { data, setData: newData => (data = newData), initData: { config: { output: { code: 'init' } } } }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    expect(data.config?.output?.code).toEqual('init');
    expect(data.config?.output?.map).toEqual({});
  });

  test('reset - enable Sudo', () => {
    let data: DeepPartial<ElementData> = {
      config: { output: { map: { key: 'value' }, code: 'code' }, sudo: true }
    };
    const view = renderHook(() => useOutputPart({ showSudo: true }), {
      wrapperProps: { data, setData: newData => (data = newData), initData: { config: { sudo: false } } }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    expect(data.config?.sudo).toEqual(false);
  });
});
