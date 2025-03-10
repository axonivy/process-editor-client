import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import { useMailData } from './useMailData';
import type { MailData } from '@axonivy/process-editor-inscription-protocol';
import { deepEqual } from '../../../utils/equals';
import { useValidations } from '../../../context/useValidation';
import type { BrowserType } from '../../browser/useBrowser';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { PathFieldset } from '../common/path/PathFieldset';
import { MacroInput } from '../../widgets/code-editor/MacroInput';
import { IvyIcons } from '@axonivy/ui-icons';

export function useMailHeaderPart(): PartProps {
  const { config, initConfig, defaultConfig, resetHeaders } = useMailData();
  const compareData = (data: MailData) => [data.headers];
  const headerValidations = useValidations(['headers']);
  const state = usePartState(compareData(defaultConfig), compareData(config), headerValidations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return {
    name: 'Header',
    state,
    reset: { dirty, action: () => resetHeaders() },
    content: <MailHeaderPart />,
    icon: IvyIcons.EMail
  };
}

const MailHeaderPart = () => {
  const { config, defaultConfig, updateHeader } = useMailData();
  const borwserTypes: BrowserType[] = ['attr', 'func', 'cms'];

  return (
    <>
      <PathCollapsible label='Headers' path='headers' defaultOpen={!deepEqual(config.headers, defaultConfig.headers)}>
        <PathFieldset label='Subject' path='subject'>
          <MacroInput value={config.headers.subject} onChange={change => updateHeader('subject', change)} browsers={borwserTypes} />
        </PathFieldset>
        <PathFieldset label='From' path='from'>
          <MacroInput value={config.headers.from} onChange={change => updateHeader('from', change)} browsers={borwserTypes} />
        </PathFieldset>
        <PathFieldset label='Reply to' path='replyTo'>
          <MacroInput value={config.headers.replyTo} onChange={change => updateHeader('replyTo', change)} browsers={borwserTypes} />
        </PathFieldset>
        <PathFieldset label='To' path='to'>
          <MacroInput value={config.headers.to} onChange={change => updateHeader('to', change)} browsers={borwserTypes} />
        </PathFieldset>
        <PathFieldset label='CC' path='cc'>
          <MacroInput value={config.headers.cc} onChange={change => updateHeader('cc', change)} browsers={borwserTypes} />
        </PathFieldset>
        <PathFieldset label='BCC' path='bcc'>
          <MacroInput value={config.headers.bcc} onChange={change => updateHeader('bcc', change)} browsers={borwserTypes} />
        </PathFieldset>
      </PathCollapsible>
    </>
  );
};
