import type { RestRequestData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { render, screen } from 'test-utils';
import { RestBodyRaw } from './RestBodyRaw';
import { describe, test, expect } from 'vitest';

describe('RestBodyRaw', () => {
  function renderPart(data?: DeepPartial<RestRequestData>) {
    render(<RestBodyRaw />, { wrapperProps: { data: data && { config: data } } });
  }

  test('empty', async () => {
    renderPart();
    expect(screen.getByTestId('code-editor')).toHaveValue('');
  });

  test('data', async () => {
    renderPart({ body: { raw: 'hi' } });
    expect(screen.getByTestId('code-editor')).toHaveValue('hi');
  });
});
