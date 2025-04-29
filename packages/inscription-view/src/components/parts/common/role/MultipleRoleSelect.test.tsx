import { customRender, screen } from 'test-utils';
import MultipleRoleSelect from './MultipleRoleSelect';
import type { RoleMeta } from '@axonivy/process-editor-inscription-protocol';
import { describe, test, expect } from 'vitest';

describe('MultipleRoleSelect', () => {
  function renderSelect(roles: string[]) {
    const roleTree: RoleMeta = {
      id: 'Everybody',
      label: 'In this role is everyone',
      children: [
        { id: 'Employee', label: '', children: [] },
        { id: 'Teamleader', label: '', children: [] }
      ]
    };
    customRender(<MultipleRoleSelect value={roles} onChange={() => {}} defaultRoles={['Everybody']} />, {
      wrapperProps: { meta: { roleTree } }
    });
  }

  test('default option', async () => {
    renderSelect([]);
    const roles = screen.getAllByRole('gridcell');
    expect(roles).toHaveLength(1);
    expect(roles[0]).toHaveTextContent('Everybody');
  });

  test('unknown option', async () => {
    renderSelect(['unknown']);
    const roles = screen.getAllByRole('gridcell');
    expect(roles).toHaveLength(1);
    expect(roles[0]).toHaveTextContent('unknown');
  });

  test('selected option', async () => {
    renderSelect(['Teamleader']);
    const roles = screen.getAllByRole('gridcell');
    expect(roles).toHaveLength(1);
    expect(roles[0]).toHaveTextContent('Teamleader');
  });
});
