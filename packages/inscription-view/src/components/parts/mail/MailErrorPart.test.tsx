import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, SelectUtil, render, renderHook, screen } from 'test-utils';
import type { MailData } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../editors/part/usePart';
import { describe, test, expect } from 'vitest';
import { useMailErrorPart } from './MailErrorPart';

const Part = () => {
  const part = useMailErrorPart();
  return <>{part.content}</>;
};

describe('MailErrorPart', () => {
  function renderPart(data?: DeepPartial<MailData>) {
    render(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Error');
  });

  test('full data', async () => {
    const data: DeepPartial<MailData> = {
      failIfMissingAttachments: true,
      exceptionHandler: 'f9'
    };
    renderPart(data);
    await CollapsableUtil.assertOpen('Error');
    await SelectUtil.assertValue('f9');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<MailData>) {
    const { result } = renderHook(() => useMailErrorPart(), { wrapperProps: { data: data && { config: data } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { failIfMissingAttachments: true });
    assertState('configured', { exceptionHandler: 'hi' });
  });

  test('reset', () => {
    let data = {
      config: {
        failIfMissingAttachments: true,
        exceptionHandler: 'hi'
      }
    };
    const view = renderHook(() => useMailErrorPart(), {
      wrapperProps: { data, setData: newData => (data = newData), initData: { config: { exceptionHandler: 'init' } } }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    expect(data.config.failIfMissingAttachments).toBeFalsy();
    expect(data.config.exceptionHandler).toEqual('init');
  });
});
