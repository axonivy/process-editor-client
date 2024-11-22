import PrioritySelect from './PrioritySelect';
import type { WfPriority, WfLevel } from '@axonivy/process-editor-inscription-protocol';
import { render, screen, SelectUtil } from 'test-utils';
import { describe, test, expect } from 'vitest';

describe('PrioritySelect', () => {
  function renderSelect(options?: { level?: string; script?: string }) {
    const priority: WfPriority = { level: options?.level as WfLevel, script: options?.script ?? '' };
    render(<PrioritySelect priority={priority} updatePriority={() => {}} />);
  }

  test('priority select will render with default option', async () => {
    renderSelect();
    await SelectUtil.assertValue('Normal');
    await SelectUtil.assertOptionsCount(5);
  });

  test('priority select will render unknown value', async () => {
    renderSelect({ level: 'bla' });
    await SelectUtil.assertValue('Normal');
  });

  test('priority select input will not render', async () => {
    renderSelect({ level: 'LOW' });
    await SelectUtil.assertValue('Low');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  test('priority select input will render for script option', async () => {
    renderSelect({ level: 'SCRIPT', script: 'this is a script' });
    await SelectUtil.assertValue('Script');
    expect(screen.getByRole('textbox')).toHaveValue('this is a script');
  });
});
