import type { SelectItem } from '../../../widgets';
import { Select } from '../../../widgets';
import { useQueryData } from '../useQueryData';
import { PathFieldset } from '../../common';
import type { QueryKind } from '@axonivy/process-editor-inscription-protocol';
import { QUERY_KIND } from '@axonivy/process-editor-inscription-protocol';
import { PathContext } from '../../../../context';
import { useMemo } from 'react';

export const QueryKindSelect = () => {
  const { config, updateSql } = useQueryData();
  const items = useMemo<SelectItem[]>(() => Object.entries(QUERY_KIND).map(([label, value]) => ({ label, value })), []);

  return (
    <PathContext path='sql'>
      <PathFieldset label='Query Kind' path='kind'>
        <Select
          value={{ label: config.query.sql.kind, value: config.query.sql.kind }}
          onChange={item => updateSql('kind', item.value as QueryKind)}
          items={items}
        />
      </PathFieldset>
    </PathContext>
  );
};
