import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, render, renderHook, screen } from 'test-utils';
import type { MailData } from '@axonivy/process-editor-inscription-protocol';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useMailHeaderPart } from './MailHeaderPart';
import { describe, test, expect } from 'vitest';

const Part = () => {
  const part = useMailHeaderPart();
  return <>{part.content}</>;
};

describe('MailHeaderPart', () => {
  function renderPart(data?: DeepPartial<MailData>) {
    render(<Part />, { wrapperProps: { data: data && { config: data } } });
  }

  async function assertPage(data?: DeepPartial<MailData>) {
    expect(screen.getByLabelText('Subject')).toHaveValue(data?.headers?.subject ?? '');
    expect(screen.getByLabelText('From')).toHaveValue(data?.headers?.from ?? '');
    expect(screen.getByLabelText('Reply to')).toHaveValue(data?.headers?.replyTo ?? '');
    expect(screen.getByLabelText('To')).toHaveValue(data?.headers?.to ?? '');
    expect(screen.getByLabelText('CC')).toHaveValue(data?.headers?.cc ?? '');
    expect(screen.getByLabelText('BCC')).toHaveValue(data?.headers?.bcc ?? '');
  }

  test('empty data', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Header');
  });

  test('full data', async () => {
    const data: DeepPartial<MailData> = {
      headers: { subject: 'sub', from: 'from', replyTo: 'reply', to: 'to', cc: 'cc', bcc: 'bcc' }
    };
    renderPart(data);
    await assertPage(data);
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<MailData>) {
    const { result } = renderHook(() => useMailHeaderPart(), { wrapperProps: { data: data && { config: data } } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { headers: { subject: 's' } });
    assertState('configured', { headers: { from: 's' } });
    assertState('configured', { headers: { to: 's' } });
    assertState('configured', { headers: { replyTo: 's' } });
    assertState('configured', { headers: { cc: 's' } });
    assertState('configured', { headers: { bcc: 's' } });
  });

  test('reset', () => {
    let data = {
      config: {
        headers: { subject: 'sub', from: 'from', replyTo: 'reply', to: 'to', cc: 'cc', bcc: 'bcc' }
      }
    };
    const view = renderHook(() => useMailHeaderPart(), {
      wrapperProps: { data, setData: newData => (data = newData), initData: { config: { headers: { subject: 'init' } } } }
    });
    expect(view.result.current.reset.dirty).toEqual(true);

    view.result.current.reset.action();
    expect(data.config.headers.subject).toEqual('init');
    expect(data.config.headers.from).toEqual('');
    expect(data.config.headers.replyTo).toEqual('');
    expect(data.config.headers.cc).toEqual('');
    expect(data.config.headers.bcc).toEqual('');
    expect(data.config.headers.to).toEqual('');
  });
});
