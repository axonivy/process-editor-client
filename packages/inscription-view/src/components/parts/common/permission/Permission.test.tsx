import { CollapsableUtil, SelectUtil, render, screen } from 'test-utils';
import { Permission } from './Permission';
import { describe, test, expect } from 'vitest';

const defaultConfig = { anonymous: true, error: 'ivy:security:forbidden', roles: ['Everybody'] };

describe('Permission', () => {
  function renderPart(data: PermissionTestData) {
    render(
      <Permission
        anonymousFieldActive={data.anonymousFieldActive}
        config={{ anonymous: data.anonymous, error: data.error, roles: data.roles }}
        defaultConfig={defaultConfig}
        updatePermission={() => {}}
      />
    );
  }

  test('data', async () => {
    const data: PermissionTestData = {
      anonymousFieldActive: false,
      anonymous: true,
      error: 'bla error',
      roles: ['Test']
    };
    renderPart(data);
    await CollapsableUtil.assertOpen('Permission');
    SelectUtil.assertValue('Test', { label: 'Role' });
    SelectUtil.assertValue('>> Ignore Exception', { label: 'Violation error' });
    expect(screen.queryByText('Anonymous')).not.toBeInTheDocument();
  });

  test('closed if empty', async () => {
    const data: PermissionTestData = {
      anonymousFieldActive: false,
      anonymous: true,
      error: 'ivy:security:forbidden',
      roles: ['Everybody']
    };
    renderPart(data);
    await CollapsableUtil.assertClosed('Permission');
  });

  test('allowIsAvailable', async () => {
    const data: PermissionTestData = {
      anonymousFieldActive: true,
      anonymous: false,
      error: 'bla error',
      roles: ['Test']
    };
    renderPart(data);
    expect(screen.getByText('Allow anonymous')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
  });

  test('roleIsDisabled', async () => {
    const data: PermissionTestData = {
      anonymousFieldActive: true,
      anonymous: true,
      error: 'bla error',
      roles: ['Test']
    };
    renderPart(data);
    expect(screen.queryByText('Role')).not.toBeInTheDocument();
  });
});

interface PermissionTestData {
  anonymousFieldActive: boolean;
  anonymous: boolean;
  error: string;
  roles: string[];
}
