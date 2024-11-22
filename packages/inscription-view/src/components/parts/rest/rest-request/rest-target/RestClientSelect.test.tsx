import type { RestRequestData } from '@axonivy/process-editor-inscription-protocol';
import { RestClientSelect } from './RestClientSelect';
import type { DeepPartial } from 'test-utils';
import { render, SelectUtil } from 'test-utils';
import { describe, test } from 'vitest';

describe('RestClientSelect', () => {
  function renderSelect(data?: DeepPartial<RestRequestData>) {
    const restClients = [
      { clientId: '0', name: 'fake' },
      { clientId: '1234', name: 'personService' }
    ];
    render(<RestClientSelect />, { wrapperProps: { data: data && { config: data }, meta: { restClients } } });
  }

  test('render', async () => {
    renderSelect();
    await SelectUtil.assertEmpty();
    await SelectUtil.assertOptionsCount(2);
  });

  test('unknown value', async () => {
    renderSelect({ target: { clientId: 'unknown' } });
    await SelectUtil.assertValue('unknown');
  });

  test('known value', async () => {
    renderSelect({ target: { clientId: '1234' } });
    await SelectUtil.assertValue('personService');
  });
});
