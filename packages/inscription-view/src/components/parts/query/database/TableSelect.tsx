import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import { PathContext } from '../../../../context/usePath';
import Combobox, { type ComboboxItem } from '../../../widgets/combobox/Combobox';
import { PathFieldset } from '../../common/path/PathFieldset';
import { useQueryData } from '../useQueryData';

export const TableSelect = () => {
  const { config, updateSql } = useQueryData();

  const { elementContext: context } = useEditorContext();
  const tableItems = useMeta('meta/database/tables', { context, database: config.query.dbName }, []).data.map<ComboboxItem>(table => {
    return { value: table };
  });

  return (
    <PathContext path='sql'>
      <PathFieldset label='Table' path='table'>
        <Combobox value={config.query.sql.table} onChange={change => updateSql('table', change)} items={tableItems} />
      </PathFieldset>
    </PathContext>
  );
};
