import { CollapsableUtil, customRender, screen } from 'test-utils';
import { Condition } from './Condition';
import { describe, test, expect } from 'vitest';

describe('Condition', () => {
  test('data', async () => {
    customRender(<Condition />, {
      wrapperProps: { data: { config: { query: { sql: { condition: 'test' } } } } }
    });
    await CollapsableUtil.assertOpen('Condition');
    expect(screen.getByRole('textbox')).toHaveValue('test');
  });
});
