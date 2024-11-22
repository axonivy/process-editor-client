import type { ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { deepEqual } from '../../../utils/equals';

export type PartStateFlag = 'configured' | 'warning' | 'error' | undefined;

export type PartState = {
  state: PartStateFlag;
  validations: ValidationResult[];
};

export type PartProps = {
  name: string;
  state: PartState;
  reset: { dirty: boolean; action: () => void };
  content: ReactNode;
  control?: ReactNode;
};

export function usePartState(defaultData: unknown, data: unknown, validations: ValidationResult[]): PartState {
  const state = useMemo(() => {
    if (validations.find(message => message?.severity === 'ERROR')) {
      return 'error';
    }
    if (validations.find(message => message?.severity === 'WARNING')) {
      return 'warning';
    }
    return deepEqual(data, defaultData) ? undefined : 'configured';
  }, [validations, data, defaultData]);
  return { state, validations };
}

export function usePartDirty(initData: unknown, data: unknown): boolean {
  return useMemo<boolean>(() => {
    return !deepEqual(data, initData);
  }, [data, initData]);
}
