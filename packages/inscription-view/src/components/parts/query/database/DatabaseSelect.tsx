import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import Select, { type SelectItem } from '../../../widgets/select/Select';
import { PathFieldset } from '../../common/path/PathFieldset';
import { useQueryData } from '../useQueryData';

export const DatabaseSelect = () => {
  const { t } = useTranslation();
  const { config, update } = useQueryData();
  const { context } = useEditorContext();
  const databaseItems = useMeta('meta/database/names', context, []).data.map<SelectItem>(db => {
    return { label: db, value: db };
  });

  return (
    <PathFieldset label={t('label.database')} path='dbName'>
      <Select
        value={{ label: config.query.dbName, value: config.query.dbName }}
        onChange={item => update('dbName', item.value)}
        items={databaseItems}
      />
    </PathFieldset>
  );
};
