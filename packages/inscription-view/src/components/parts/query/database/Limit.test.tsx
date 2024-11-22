import { CollapsableUtil, render, screen } from 'test-utils';
import { Limit } from './Limit';
import { describe, test, expect } from 'vitest';

describe('Limit', () => {
  test('data', async () => {
    render(<Limit />, { wrapperProps: { data: { config: { query: { limit: '123', offset: '456' } } } } });
    await CollapsableUtil.assertOpen('Limit');
    expect(screen.getByLabelText('Lot size')).toHaveValue('123');
    expect(screen.getByLabelText('Start index')).toHaveValue('456');
  });
});
