import type { DeepPartial } from 'test-utils';
import { render, CollapsableUtil, TableUtil, ComboboxUtil, userEvent, screen } from 'test-utils';
import type { WsRequestData } from '@axonivy/process-editor-inscription-protocol';
import { WsProperties } from './WsProperties';
import { describe, test } from 'vitest';

describe('WsProperties', () => {
  function renderPart(data?: DeepPartial<WsRequestData>) {
    render(<WsProperties />, { wrapperProps: { data: data && { config: data }, meta: { wsProperties: ['Super', 'soaper', '132'] } } });
  }

  test('empty', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Properties');
  });

  test('data', async () => {
    renderPart({ properties: { soaper: 'value' } });
    await CollapsableUtil.assertOpen('Properties');
    TableUtil.assertRows(['soaper value']);
    await userEvent.click(screen.getByRole('row', { name: 'soaper value' }));
    await ComboboxUtil.assertValue('soaper');
    await ComboboxUtil.assertOptionsCount(3);
  });
});
