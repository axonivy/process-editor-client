import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, customRender, customRenderHook, screen } from 'test-utils';
import type { WebServiceProcessData, ElementData, ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useWebServiceProcessPart } from './WebServiceProcessPart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useWebServiceProcessPart();
  return <>{part.content}</>;
};

describe('WebServiceProcessPart', () => {
  function renderPart(data?: WebServiceProcessData) {
    customRender(<Part />, {
      wrapperProps: { data: data && { config: data } }
    });
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Process');
  });

  test('full data', async () => {
    renderPart({
      wsAuth: 'HTTP_BASIC',
      wsTypeName: 'Test'
    });
    expect(screen.getByLabelText('Qualified name')).toHaveValue('Test');
    expect(screen.getByRole('radio', { name: 'WS Security' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'HTTP Basic' })).toBeChecked();
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<WebServiceProcessData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useWebServiceProcessPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', {
      wsAuth: 'HTTP_BASIC',
      wsTypeName: 'Test'
    });

    assertState('error', undefined, { path: 'wsAuth.cause', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'wsTypeName.error', message: '', severity: 'WARNING' });
  });

  test('reset', () => {
    let data: DeepPartial<ElementData> = {
      config: {
        wsAuth: 'HTTP_BASIC',
        wsTypeName: 'Test'
      }
    };
    const view = customRenderHook(() => useWebServiceProcessPart(), {
      wrapperProps: { data, setData: newData => (data = newData) }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    expect(data.config?.wsAuth).toEqual('NONE');
    expect(data.config?.wsTypeName).toEqual('');
  });
});
