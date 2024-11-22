import { renderHook } from 'test-utils';
import type { PartStateFlag } from './usePart';
import { usePartState } from './usePart';
import type { ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import { describe, test, expect } from 'vitest';

describe('PartState', () => {
  function assertState(expectedState: PartStateFlag, data?: unknown, message?: ValidationResult[]) {
    const { result } = renderHook(() => usePartState({}, data ?? {}, message ?? []));
    expect(result.current.state).toEqual(expectedState);
  }

  test('states', async () => {
    assertState(undefined);
    assertState('configured', { something: 'else' });
    assertState('configured', { something: 'else' }, [{ path: '', severity: 'INFO', message: '' }]);
    assertState('warning', { something: 'else' }, [
      { path: '', severity: 'INFO', message: '' },
      { path: '', severity: 'WARNING', message: '' }
    ]);
    assertState('error', { something: 'else' }, [
      { path: '', severity: 'INFO', message: '' },
      { path: '', severity: 'WARNING', message: '' },
      { path: '', severity: 'ERROR', message: '' }
    ]);
  });
});
