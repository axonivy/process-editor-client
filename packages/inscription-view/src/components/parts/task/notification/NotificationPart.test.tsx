import type { WfTask } from '@axonivy/process-editor-inscription-protocol';
import { SelectUtil, render, screen, userEvent } from 'test-utils';
import { describe, test, expect } from 'vitest';
import NotificationPart from './NotificationPart';

describe('NotificationPart', () => {
  function renderTaskPart(data?: Partial<WfTask>) {
    render(<NotificationPart />, { wrapperProps: { data: data && { config: { task: data } } } });
  }

  test('empty', async () => {
    renderTaskPart();
    await userEvent.click(screen.getByRole('button', { name: /Notification/ }));
    expect(screen.getByLabelText('Suppress')).not.toBeChecked();
    SelectUtil.assertValue('Default', { label: 'Template' });
  });

  test('configured', async () => {
    renderTaskPart({ notification: { suppress: true, template: 'Customer' } });
    expect(screen.getByLabelText('Suppress')).toBeChecked();
    SelectUtil.assertValue('Customer', { label: 'Template' });
  });
});
