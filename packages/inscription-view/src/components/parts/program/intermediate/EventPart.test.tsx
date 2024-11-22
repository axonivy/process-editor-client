import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, ComboboxUtil, SelectUtil, render, renderHook, screen } from 'test-utils';
import type { ElementData, EventData, ValidationResult } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../../editors/part/usePart';
import { useEventPart } from './EventPart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useEventPart();
  return <>{part.content}</>;
};

describe('EventPart', () => {
  function renderPart(data?: DeepPartial<EventData>) {
    render(<Part />, {
      wrapperProps: { data: data && { config: data } }
    });
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Java Class');
    await CollapsableUtil.assertClosed('Event ID');
    await CollapsableUtil.assertClosed('Expiry');
  });

  test('full data', async () => {
    renderPart({
      javaClass: 'Test',
      eventId: '123',
      timeout: {
        error: 'ivy:error:program:timeout',
        action: 'DESTROY_TASK',
        duration: '456'
      }
    });
    await ComboboxUtil.assertValue('Test', { nth: 0 });
    expect(screen.getAllByTestId('code-editor')[0]).toHaveValue('123');
    await CollapsableUtil.assertOpen('Expiry');
    await SelectUtil.assertValue('ivy:error:program:timeout', { index: 1 });
    expect(screen.getByLabelText('Duration')).toHaveValue('456');
    expect(screen.getByRole('radio', { name: 'Do nothing' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Delete the Task' })).toBeChecked();
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<EventData>, validation?: ValidationResult) {
    const { result } = renderHook(() => useEventPart(), {
      wrapperProps: { data: data && { config: data }, validations: validation && [validation] }
    });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { javaClass: 'Bla' });
    assertState('configured', { eventId: '123' });
    assertState('configured', { timeout: { duration: '123' } });

    assertState('error', undefined, { path: 'javaClass.cause', message: '', severity: 'ERROR' });
    assertState('warning', undefined, { path: 'eventId.error', message: '', severity: 'WARNING' });
    assertState('warning', undefined, { path: 'timeout.error', message: '', severity: 'WARNING' });
  });

  test('reset', () => {
    let data: DeepPartial<ElementData> = {
      config: { javaClass: 'Test', eventId: '123', timeout: { duration: '456' } }
    };
    const view = renderHook(() => useEventPart(), {
      wrapperProps: { data, setData: newData => (data = newData) }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    expect(data.config?.javaClass).toEqual('');
    expect(data.config?.eventId).toEqual('');
    expect(data.config?.timeout?.duration).toEqual('');
  });
});
