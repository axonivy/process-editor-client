import { useEditorContext, useMeta } from '../../../../context';
import type { SelectItem } from '../../../widgets';
import { Select } from '../../../widgets';
import { PathFieldset } from '../../common';
import { useQueryData } from '../useQueryData';

export const DatabaseSelect = () => {
  const { config, update } = useQueryData();

  const { context } = useEditorContext();
  const databaseItems = useMeta('meta/database/names', context, []).data.map<SelectItem>(db => {
    return { label: db, value: db };
  });

  return (
    <PathFieldset label='Database' path='dbName'>
      <Select
        value={{ label: config.query.dbName, value: config.query.dbName }}
        onChange={item => update('dbName', item.value)}
        items={databaseItems}
      />
    </PathFieldset>
  );
};
