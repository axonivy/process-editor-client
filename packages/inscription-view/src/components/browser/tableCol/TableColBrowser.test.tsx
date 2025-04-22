import { TableUtil, customRender, customRenderHook } from 'test-utils';
import { useTableColBrowser } from './TableColBrowser';
import { describe, test } from 'vitest';

describe('TableColBrowser', () => {
  test('select can be undefined', async () => {
    const { result } = customRenderHook(() => useTableColBrowser(() => {}));
    customRender(<>{result.current.content}</>, {
      wrapperProps: { data: { config: { query: { sql: { stmt: 'hi', select: undefined } } } } }
    });
    await TableUtil.assertRowCount(1);
  });
});
