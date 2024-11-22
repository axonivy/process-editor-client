import { CollapsableUtil, SelectUtil, render, screen } from 'test-utils';
import { Permission } from './Permission';
import { describe, test, expect } from 'vitest';

const defaultConfig = { anonymous: true, error: 'Everybody', role: 'ivy:security:forbidden' };

describe('Permission', () => {
  function renderPart(anonymousFieldActive: boolean, anonymous: boolean, error: string, role: string) {
    render(
      <Permission
        anonymousFieldActive={anonymousFieldActive}
        config={{ anonymous: anonymous, error: error, role: role }}
        defaultConfig={defaultConfig}
        updatePermission={() => {}}
      />
    );
  }

  test('data', async () => {
    renderPart(false, true, 'bla error', 'Test');
    await CollapsableUtil.assertOpen('Permission');
    SelectUtil.assertValue('Test', { label: 'Role' });
    SelectUtil.assertValue('>> Ignore Exception', { label: 'Violation error' });
    expect(screen.queryByText('Anonymous')).not.toBeInTheDocument();
  });

  test('closed if empty', async () => {
    renderPart(false, true, 'Everybody', 'ivy:security:forbidden');
    await CollapsableUtil.assertClosed('Permission');
  });

  test('allowIsAvailable', async () => {
    renderPart(true, false, 'bla error', 'Test');
    expect(screen.queryByText('Allow anonymous')).toBeInTheDocument();
    expect(screen.queryByText('Role')).toBeInTheDocument();
  });

  test('roleIsDisabled', async () => {
    renderPart(true, true, 'bla error', 'Test');
    expect(screen.queryByText('Role')).not.toBeInTheDocument();
  });
});
