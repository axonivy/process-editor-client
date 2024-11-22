import { CollapsableUtil, render, screen } from 'test-utils';
import { Statement } from './Statement';
import { describe, test, expect } from 'vitest';

describe('Statement', () => {
  test('data', async () => {
    render(<Statement />, {
      wrapperProps: { data: { config: { query: { sql: { stmt: 'test' } } } } }
    });
    await CollapsableUtil.assertOpen('Definition');
    expect(screen.getByRole('textbox')).toHaveValue('test');
  });
});
