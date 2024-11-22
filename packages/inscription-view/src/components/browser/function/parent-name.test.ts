import { expect, test } from 'vitest';
import type { Row } from '@tanstack/react-table';
import type { Function } from '@axonivy/process-editor-inscription-protocol';
import { getParentNames } from './parent-name';
import type { DeepPartial } from '../../../test-utils/type-utils';

const mockFunction: DeepPartial<Row<Function>> = {
  original: {
    isField: true,
    name: 'ivy.cal',
    params: [],
    returnType: {
      functions: [],
      packageName: 'mockPackage',
      simpleName: 'mockSimpleName'
    }
  },
  getParentRow: () => ({
    original: {
      isField: false,
      name: 'get',
      params: [{ name: 'param1', type: 'String' }],
      returnType: {
        functions: [],
        packageName: 'mockPackage',
        simpleName: 'mockSimpleName'
      }
    },
    getParentRow: () => ({
      original: {
        isField: false,
        name: 'getBusinessDuration',
        params: [
          { name: 'param2', type: 'DateTime' },
          { name: 'param3', type: 'DateTime' }
        ],
        returnType: {
          functions: [],
          packageName: 'mockPackage',
          simpleName: 'mockSimpleName'
        }
      },
      getParentRow: () => undefined
    })
  })
};

test('getParentNames from mockFunction', () => {
  expect(getParentNames(mockFunction as Row<Function>)).toEqual(['ivy.cal', 'get(String)', 'getBusinessDuration(DateTime, DateTime)']);
});
