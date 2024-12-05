import { IvyIcons } from '@axonivy/ui-icons';
import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import { useSignalCatchData } from './useSignalCatchData';
import type { SignalCatchData } from '@axonivy/process-editor-inscription-protocol';
import { classifiedItemInfo } from '../../../utils/event-code-categorie';
import { useValidations } from '../../../context/useValidation';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import type { ClassifiedItem } from '../common/classification/ClassificationCombobox';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import ClassificationCombobox from '../common/classification/ClassificationCombobox';
import Checkbox from '../../widgets/checkbox/Checkbox';

export function useSignalCatchPart(options?: { makroSupport?: boolean; withBrowser?: boolean }): PartProps {
  const { config, defaultConfig, initConfig, resetData } = useSignalCatchData();
  const compareData = (data: SignalCatchData) => [data.signalCode, options?.makroSupport ? '' : data.attachToBusinessCase];
  const validations = useValidations(['signalCode']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return {
    name: 'Signal',
    state,
    reset: { dirty, action: () => resetData() },
    content: <SignalCatchPart makroSupport={options?.makroSupport} withBrowser={options?.withBrowser} />
  };
}

const SignalCatchPart = ({ makroSupport, withBrowser }: { makroSupport?: boolean; withBrowser?: boolean }) => {
  const { config, defaultConfig, update, updateSignal } = useSignalCatchData();
  const { context } = useEditorContext();
  const signalCodes = [
    { value: '', label: '<< Empty >>', info: 'Receives every signal' },
    ...useMeta('meta/workflow/signalCodes', { context, macro: !!makroSupport }, []).data.map<ClassifiedItem>(code => {
      return { ...code, value: code.eventCode, info: classifiedItemInfo(code) };
    })
  ];

  return (
    <PathCollapsible label='Signal Code' path='signalCode' defaultOpen={config.signalCode !== defaultConfig.signalCode}>
      <ValidationFieldset>
        <ClassificationCombobox
          value={config.signalCode}
          onChange={change => updateSignal(change)}
          data={signalCodes}
          icon={IvyIcons.StartSignal}
          withBrowser={withBrowser}
        />
      </ValidationFieldset>
      {!makroSupport && (
        <Checkbox
          label='Attach to Business Case that signaled this process'
          value={config.attachToBusinessCase}
          onChange={change => update('attachToBusinessCase', change)}
        />
      )}
    </PathCollapsible>
  );
};
