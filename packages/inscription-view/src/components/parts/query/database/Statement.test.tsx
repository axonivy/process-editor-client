import { CollapsableUtil, customRender, screen } from 'test-utils';
import { Statement } from './Statement';
import { describe, test, expect } from 'vitest';

describe('Statement', () => {
  test('data', async () => {
    customRender(<Statement />, {
      wrapperProps: { data: { config: { query: { sql: { stmt: 'test' } } } } }
    });
    await CollapsableUtil.assertOpen('Definition');
    expect(screen.getByRole('textbox')).toHaveValue('test');
  });
});
