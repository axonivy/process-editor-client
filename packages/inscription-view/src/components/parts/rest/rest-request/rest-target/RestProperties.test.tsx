import type { DeepPartial } from 'test-utils';
import { render, CollapsableUtil, TableUtil, ComboboxUtil, userEvent, screen } from 'test-utils';
import type { RestRequestData } from '@axonivy/process-editor-inscription-protocol';
import { RestProperties } from './RestProperties';
import { describe, test } from 'vitest';

describe('RestProperties', () => {
  function renderPart(data?: DeepPartial<RestRequestData>) {
    render(<RestProperties />, {
      wrapperProps: { data: data && { config: data }, meta: { restProperties: ['username', 'rester', '132'] } }
    });
  }

  test('empty', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Properties');
  });

  test('data', async () => {
    renderPart({ target: { properties: { rester: 'value' } } });

    await CollapsableUtil.assertOpen('Properties');
    TableUtil.assertRows(['rester value']);
    await userEvent.click(screen.getByRole('row', { name: 'rester value' }));
    await ComboboxUtil.assertValue('rester');
    await ComboboxUtil.assertOptionsCount(3);
  });
});
