import { render, SelectUtil } from 'test-utils';
import RoleSelect from './RoleSelect';
import type { RoleMeta } from '@axonivy/process-editor-inscription-protocol';
import { describe, test } from 'vitest';

describe('RoleSelect', () => {
  function renderSelect(activator?: string) {
    const roleTree: RoleMeta = {
      id: 'Everybody',
      label: 'In this role is everyone',
      children: [
        { id: 'Employee', label: '', children: [] },
        { id: 'Teamleader', label: '', children: [] }
      ]
    };
    render(<RoleSelect value={activator} onChange={() => {}} />, {
      wrapperProps: { meta: { roleTree } }
    });
  }

  test('default option', async () => {
    renderSelect();
    await SelectUtil.assertValue('Everybody');
  });

  test('unknown option', async () => {
    renderSelect('unknown');
    await SelectUtil.assertValue('unknown');
  });

  test('selected option', async () => {
    renderSelect('Teamleader');
    await SelectUtil.assertValue('Teamleader');
  });
});
