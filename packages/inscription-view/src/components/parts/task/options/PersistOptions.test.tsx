import PersistOptions from './PersistOptions';
import type { TaskData } from '@axonivy/process-editor-inscription-protocol';
import { customRender, screen, userEvent } from 'test-utils';
import { describe, test, expect } from 'vitest';

describe('PersistOptions', () => {
  function renderTaskPart(data?: Partial<TaskData>) {
    customRender(<PersistOptions />, { wrapperProps: { data: data && { config: data } } });
  }

  test('empty', async () => {
    renderTaskPart();
    const optionCollapse = screen.getByRole('button', { name: /Option/ });
    await userEvent.click(optionCollapse);
    expect(screen.getByLabelText(/Persist/)).not.toBeChecked();
  });

  test('configured', async () => {
    renderTaskPart({ persistOnStart: true });
    expect(screen.getByLabelText(/Persist/)).toBeChecked();
  });
});
