import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, customRender, customRenderHook } from 'test-utils';
import type { ElementData, ValidationResult, WsRequestData } from '@axonivy/process-editor-inscription-protocol';
import { useWsRequestPart } from './WsRequestPart';
import type { PartStateFlag } from '../../editors/part/usePart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useWsRequestPart();
  return <>{part.content}</>;
};

describe('WsRequestPart', () => {
  function renderPart(data?: DeepPartial<WsRequestData>) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Web Service');
    await CollapsableUtil.assertClosed('Properties');
    await CollapsableUtil.assertClosed('Mapping');
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<WsRequestData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useWsRequestPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { clientId: 'asdf' });
    assertState('configured', { properties: { name: 'a' } });
    assertState('configured', { operation: { name: 'asdf' } });

    assertState('error', undefined, { path: 'clientId', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'properties.name', message: '', severity: 'WARNING' });
    assertState('warning', undefined, { path: 'operation.name', message: '', severity: 'WARNING' });
  });

  test('reset', () => {
    let data: DeepPartial<ElementData> = { config: { clientId: 'client', properties: { name: 'bla' }, operation: { name: 'asdf' } } };
    const view = customRenderHook(() => useWsRequestPart(), {
      wrapperProps: { data, setData: newData => (data = newData), initData: { config: { clientId: 'init' } } }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    expect(data.config?.clientId).toEqual('init');
    expect(data.config?.properties).toEqual({});
    expect(data.config?.operation?.name).toEqual('');
  });
});
