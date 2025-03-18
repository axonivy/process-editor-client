import ResponsibleSelect from './ResponsibleSelect';
import type { RoleMeta, WfActivator, WfActivatorType } from '@axonivy/process-editor-inscription-protocol';
import { render, screen, SelectUtil } from 'test-utils';
import { describe, test, expect } from 'vitest';

describe('ResponsibleSelect', () => {
  function renderSelect(options?: { type?: WfActivatorType; activator?: string; optionsFilter?: WfActivatorType[] }) {
    const responsible: WfActivator = { type: options?.type as WfActivatorType, activator: options?.activator ?? '' };
    const roleTree: RoleMeta = {
      id: 'Everybody',
      label: 'In this role is everyone',
      children: [
        { id: 'Employee', label: '', children: [] },
        { id: 'Teamleader', label: '', children: [] }
      ]
    };
    const taskRoles: RoleMeta[] = [
      { id: 'CREATOR', label: 'CREATOR', children: [] },
      { id: 'SYSTEM', label: 'SYSTEM', children: [] }
    ];
    render(<ResponsibleSelect responsible={responsible} updateResponsible={() => {}} optionFilter={options?.optionsFilter} />, {
      wrapperProps: { meta: { roleTree, taskRoles } }
    });
  }

  test('all options', async () => {
    renderSelect({ type: 'ROLE', activator: 'bla' });
    await SelectUtil.assertValue('Role', { index: 0 });
    await SelectUtil.assertOptionsCount(4, { index: 0 });
  });

  test('no delete option', async () => {
    renderSelect({ optionsFilter: ['DELETE_TASK'] });
    await SelectUtil.assertOptionsCount(3, { index: 0 });
  });

  test('select for role option', async () => {
    renderSelect({ type: 'ROLE', activator: 'Teamleader' });
    await SelectUtil.assertValue('Role', { index: 0 });
    await SelectUtil.assertValue('Teamleader', { index: 1 });
    await SelectUtil.assertOptionsCount(5, { index: 1 });
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('input for role attr option', async () => {
    renderSelect({ type: 'ROLE_FROM_ATTRIBUTE', activator: 'role activator' });
    await SelectUtil.assertValue('Role from Attr', { index: 0 });
    expect(screen.getByRole('textbox')).toHaveValue('role activator');
  });

  test('input for user attr option', async () => {
    renderSelect({ type: 'USER_FROM_ATTRIBUTE', activator: 'user activator' });
    await SelectUtil.assertValue('User from Attr', { index: 0 });
    expect(screen.getByRole('textbox')).toHaveValue('user activator');
  });

  test('input for members attr option', async () => {
    renderSelect({ type: 'MEMBERS_FROM_ATTRIBUTE', activator: 'members activator' });
    await SelectUtil.assertValue('Members from Attr', { index: 0 });
    expect(screen.getByRole('textbox')).toHaveValue('members activator');
  });

  test('nothing for delete option', async () => {
    renderSelect({ type: 'DELETE_TASK' });
    await SelectUtil.assertValue('Nobody & delete', { index: 0 });
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
