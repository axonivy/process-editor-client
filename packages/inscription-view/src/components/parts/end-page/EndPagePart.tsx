import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
import { useEndPageData } from './useEndPageData';
import type { EndPageData } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import InputWithBrowser from '../../../components/widgets/input/InputWithBrowser';
import { useValidations } from '../../../context/useValidation';
import { useAction } from '../../../context/useAction';
import type { FieldsetControl } from '../../widgets/fieldset/fieldset-control';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';

export function useEndPagePart(): PartProps {
  const { config, initConfig, defaultConfig, update } = useEndPageData();
  const compareData = (data: EndPageData) => [data.page];
  const validations = useValidations(['page']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: 'End Page', state, reset: { dirty, action: () => update('page', initConfig.page) }, content: <EndPagePart /> };
}

const EndPagePart = () => {
  const { config, defaultConfig, update } = useEndPageData();

  const action = useAction('openEndPage');
  const openFile: FieldsetControl = { label: 'Open file', icon: IvyIcons.GoToSource, action: () => action(config.page) };
  return (
    <PathCollapsible label='End Page' controls={[openFile]} path='page' defaultOpen={config.page !== defaultConfig.page}>
      <ValidationFieldset>
        <InputWithBrowser browsers={['cms']} typeFilter={'FILE'} value={config.page} onChange={change => update('page', change)} />
      </ValidationFieldset>
    </PathCollapsible>
  );
};
