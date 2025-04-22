import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, customRender, customRenderHook, screen } from 'test-utils';
import type { ElementData, ValidationResult, RestRequestData, RestResource } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useRestRequestPart } from './RestRequestPart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useRestRequestPart();
  return <>{part.content}</>;
};

const Control = () => {
  const part = useRestRequestPart();
  return <>{part.control}</>;
};

describe('RestRequestPart', () => {
  function renderPart(data?: DeepPartial<RestRequestData>, restResources?: DeepPartial<RestResource[]>) {
    customRender(<Part />, { wrapperProps: { data: data && { config: data }, meta: { restResources } } });
  }

  test('empty', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Rest Service');
    await CollapsableUtil.assertClosed('Parameters');
    await CollapsableUtil.assertClosed('Headers');
    await CollapsableUtil.assertClosed('Properties');
  });

  test('post', async () => {
    renderPart({ method: 'POST' });
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.queryByText('JAX-RS')).not.toBeInTheDocument();
  });

  test('jax-rs', async () => {
    renderPart({ method: 'JAX_RS' });
    expect(screen.queryByText('Body')).not.toBeInTheDocument();
    expect(screen.getByText('JAX-RS')).toBeInTheDocument();
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<RestRequestData>, validation?: ValidationResult) {
    const { result } = customRenderHook(() => useRestRequestPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { code: 'code' });
    assertState('configured', { method: 'DELETE' });
    assertState('configured', { body: { mediaType: 'app/json' } });
    assertState('configured', { target: { clientId: 'client' } });

    assertState('error', undefined, { path: 'code', message: '', severity: 'ERROR' });
    assertState('error', undefined, { path: 'method', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'body.mediaType', message: '', severity: 'WARNING' });
    assertState('warning', undefined, { path: 'target.clientId', message: '', severity: 'WARNING' });
  });

  test('reset', () => {
    let data: DeepPartial<ElementData> = {
      config: { code: 'code', method: 'DELETE', target: { clientId: '123', headers: { myHeader: 'a' } }, body: { mediaType: 'type' } }
    };
    const view = customRenderHook(() => useRestRequestPart(), {
      wrapperProps: { data, setData: newData => (data = newData), initData: { config: { method: 'PUT' } } }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    expect(data.config?.code).toEqual('');
    expect(data.config?.method).toEqual('PUT');
    expect(data.config?.body?.mediaType).toEqual('application/json');
    expect(data.config?.target?.clientId).toEqual('');
    expect(data.config?.target?.headers).toEqual({ Accept: '*/*' });
  });

  async function renderControl() {
    customRender(<Control />, { wrapperProps: { data: { config: { target: { clientId: 'client' } } }, meta: { restResources: [{}] } } });
    await screen.findByText('OpenAPI');
  }

  test('openapi', async () => {
    await renderControl();
    expect(screen.getByRole('switch', { name: 'OpenAPI' })).toBeInTheDocument();
  });
});
