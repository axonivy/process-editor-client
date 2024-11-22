import type { FieldsetProps } from './Fieldset';
import Fieldset from './Fieldset';
import { render, screen, userEvent } from 'test-utils';
import { IvyIcons } from '@axonivy/ui-icons';
import type { FieldsetControl } from './fieldset-control';
import { describe, test, expect } from 'vitest';
import { Input } from '@axonivy/ui-components';

describe('Fieldset', () => {
  function renderFieldset(props: FieldsetProps) {
    render(
      <Fieldset {...props}>
        <Input />
      </Fieldset>
    );
  }

  test('render', () => {
    renderFieldset({ label: 'label' });
    expect(screen.getByLabelText('label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAccessibleName('label');
  });

  test('no label', () => {
    renderFieldset({});
    expect(screen.getByRole('textbox')).toHaveAccessibleName('');
  });

  test('message', () => {
    renderFieldset({ label: 'label', validation: { message: 'this is a error', severity: 'ERROR' } });
    expect(screen.getByTitle('this is a error')).toHaveClass('ui-message');
  });

  test('control buttons', async () => {
    let btnTrigger = false;
    const action = () => (btnTrigger = true);
    const control1: FieldsetControl = { label: 'Btn1', icon: IvyIcons.ActivitiesGroup, action };
    const control2: FieldsetControl = { label: 'Btn2', icon: IvyIcons.Plus, action, active: true };

    renderFieldset({ label: 'label', controls: [control1, control2] });
    const btn1 = screen.getByRole('button', { name: 'Btn1' });
    await userEvent.click(btn1);
    expect(btnTrigger).toBeTruthy();

    const btn2 = screen.getByRole('button', { name: 'Btn2' });
    expect(btn2).toHaveAttribute('data-state', 'on');
  });
});
