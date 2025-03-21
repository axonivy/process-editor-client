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
import { useTranslation } from 'react-i18next';

export function useEndPagePart(): PartProps {
  const { t } = useTranslation();
  const { config, initConfig, defaultConfig, update } = useEndPageData();
  const compareData = (data: EndPageData) => [data.page];
  const validations = useValidations(['page']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return {
    name: t('part.endPage.title'),
    state,
    reset: { dirty, action: () => update('page', initConfig.page) },
    content: <EndPagePart />
  };
}

const EndPagePart = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, update } = useEndPageData();
  const action = useAction('openEndPage');
  const openFile: FieldsetControl = { label: t('label.openFile'), icon: IvyIcons.GoToSource, action: () => action(config.page) };
  return (
    <PathCollapsible label={t('part.endPage.title')} controls={[openFile]} path='page' defaultOpen={config.page !== defaultConfig.page}>
      <ValidationFieldset>
        <InputWithBrowser browsers={['cms']} typeFilter={'FILE'} value={config.page} onChange={change => update('page', change)} />
      </ValidationFieldset>
    </PathCollapsible>
  );
};
