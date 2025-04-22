import { customRenderHook } from 'test-utils';
import type { PartProps, PartStateFlag } from './usePart';
import { useAccordionState, usePartState } from './usePart';
import type { ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import { describe, test, expect } from 'vitest';

describe('usePartState', () => {
  function assertState(expectedState: PartStateFlag, data?: unknown, message?: ValidationResult[]) {
    const { result } = customRenderHook(() => usePartState({}, data ?? {}, message ?? []));
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

describe('useAccordionState', () => {
  const ACCORDION_STORAGE_KEY = 'process-inscription-accordion';
  const parts = [{ name: 'General' }, { name: 'Dialog' }] as Array<PartProps>;

  test('empty storage', () => {
    const { result } = customRenderHook(() => useAccordionState(parts));
    expect(result.current.value).toEqual('');
  });

  test('wrong storage', () => {
    sessionStorage.setItem(ACCORDION_STORAGE_KEY, 'wrong');
    const { result } = customRenderHook(() => useAccordionState(parts));
    expect(result.current.value).toEqual('');
  });

  test('other storage', () => {
    sessionStorage.setItem(ACCORDION_STORAGE_KEY, `["Result"]`);
    const { result } = customRenderHook(() => useAccordionState(parts));
    expect(result.current.value).toEqual('');
  });

  test('matching storage', () => {
    sessionStorage.setItem(ACCORDION_STORAGE_KEY, `["Result", "Dialog"]`);
    const { result } = customRenderHook(() => useAccordionState(parts));
    expect(result.current.value).toEqual('Dialog');
    result.current.updateValue('');
    expect(sessionStorage.getItem(ACCORDION_STORAGE_KEY)).toEqual(`["Result"]`);
  });
});
