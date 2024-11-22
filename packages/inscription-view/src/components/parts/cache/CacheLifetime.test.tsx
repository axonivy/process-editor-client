import { render, screen } from 'test-utils';
import { CacheLifetime } from './CacheLifetime';
import { describe, test, expect } from 'vitest';

describe('CacheLifetime', () => {
  test('data', async () => {
    render(
      <CacheLifetime
        path='group'
        label='Group'
        description='This is a description'
        config={{ name: 'asdf', invalidation: 'FIXED_TIME', time: '123' }}
        updater={() => {}}
        cacheMode='CACHE'
      />
    );
    expect(screen.getByLabelText('Name')).toHaveValue('asdf');
    expect(screen.getByRole('radio', { name: 'Fixed time' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Forever' })).not.toBeChecked();
    expect(screen.getByLabelText('Lifetime')).toHaveValue('123');
  });

  test('input does not exist', async () => {
    render(
      <CacheLifetime
        path='group'
        label='Group'
        description='This is a description'
        config={{ name: 'asdf', invalidation: 'NONE', time: '' }}
        updater={() => {}}
        cacheMode='CACHE'
      />
    );
    expect(screen.getByRole('radio', { name: 'Forever' })).toBeChecked();
    expect(screen.queryByLabelText('Lifetime')).not.toBeInTheDocument();
  });
});
