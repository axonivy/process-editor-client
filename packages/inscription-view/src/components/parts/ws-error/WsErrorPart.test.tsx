import type { DeepPartial } from 'test-utils';
import { render, renderHook, CollapsableUtil, SelectUtil } from 'test-utils';
import type { ElementData, ValidationResult, WsErrorData } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useWsErrorPart } from './WsErrorPart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useWsErrorPart();
  return <>{part.content}</>;
};

describe('WsResponsePart', () => {
  function renderPart(data?: DeepPartial<WsErrorData>) {
    render(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  test('empty', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Error');
  });

  test('data', async () => {
    renderPart({ exceptionHandler: 'ex' });
    await CollapsableUtil.assertOpen('Error');
    await SelectUtil.assertValue('ex');
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<WsErrorData>, validation?: ValidationResult) {
    const { result } = renderHook(() => useWsErrorPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { exceptionHandler: 'ex' });

    assertState('error', undefined, { path: 'exceptionHandler', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'exceptionHandler', message: '', severity: 'WARNING' });
  });

  test('reset', () => {
    let data: DeepPartial<ElementData> = { config: { exceptionHandler: 'ex' } };
    const view = renderHook(() => useWsErrorPart(), {
      wrapperProps: { data, setData: newData => (data = newData), initData: { config: { exceptionHandler: 'init' } } }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    expect(data.config?.exceptionHandler).toEqual('init');
  });
});
