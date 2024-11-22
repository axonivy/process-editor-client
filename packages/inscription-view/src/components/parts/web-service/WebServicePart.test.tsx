import type { DeepPartial } from 'test-utils';
import { render, renderHook, screen } from 'test-utils';
import type { ElementData, ValidationResult, WebserviceStartData } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useWebServicePart } from './WebServicePart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useWebServicePart();
  return <>{part.content}</>;
};

describe('WebServicePart', () => {
  function renderPart(data?: WebserviceStartData) {
    render(<Part />, {
      wrapperProps: { data: data && { config: data } }
    });
  }

  test('empty data', async () => {
    renderPart();
    expect(screen.queryByText('Permission')).toBeInTheDocument();
    expect(screen.queryByText('Exception')).toBeInTheDocument();
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<WebserviceStartData>, validation?: ValidationResult) {
    const { result } = renderHook(() => useWebServicePart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', {
      permission: {
        error: '>> Ignore Exception'
      },
      exception: {
        condition: '0===0'
      }
    });

    assertState('error', undefined, { path: 'permission.cause', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'exception.error', message: '', severity: 'WARNING' });
  });

  test('reset', () => {
    let data: DeepPartial<ElementData> = {
      config: {
        exception: {
          message: 'hallo',
          enabled: true
        }
      }
    };
    const view = renderHook(() => useWebServicePart(), {
      wrapperProps: { data, setData: newData => (data = newData) }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    expect(data.config?.exception?.message).toEqual('');
    expect(data.config?.exception?.enabled).toBeFalsy();
  });
});
