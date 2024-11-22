import { SelectUtil, render } from 'test-utils';
import { DatabaseSelect } from './DatabaseSelect';
import { describe, test } from 'vitest';

describe('DatabaseSelect', () => {
  test('data', async () => {
    render(<DatabaseSelect />, {
      wrapperProps: { data: { config: { query: { dbName: 'test' } } }, meta: { databases: ['ivy', 'test', 'db'] } }
    });
    await SelectUtil.assertValue('test');
    await SelectUtil.assertOptionsCount(3);
  });
});
