import type { Dispatch } from 'react';
import { useState } from 'react';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ColumnFiltersState, Row } from '@tanstack/react-table';
import type { MappingTreeData } from './mapping-tree-data';
import type { FieldsetControl } from '../../../widgets/fieldset/fieldset-control';
import { useTranslation } from 'react-i18next';

export type TableFilter<TFilter> = {
  active: boolean;
  filter: TFilter;
  setFilter: Dispatch<React.SetStateAction<TFilter>>;
  control: FieldsetControl;
};

export const useTableGlobalFilter = (): TableFilter<string> => {
  const { t } = useTranslation();
  const [active, setActive] = useState(false);
  const [filter, setFilter] = useState('');
  return {
    active: active,
    filter,
    setFilter,
    control: {
      label: t('common:label.search'),
      icon: IvyIcons.Search,
      active,
      action: () => {
        setActive(show => !show);
        setFilter('');
      }
    }
  };
};

export const useTableOnlyInscribed = (): TableFilter<ColumnFiltersState> => {
  const { t } = useTranslation();
  const [active, setActive] = useState(false);
  const [filter, setFilter] = useState<ColumnFiltersState>([]);
  return {
    active,
    filter,
    setFilter,
    control: {
      label: t('label.mapped'),
      icon: IvyIcons.Rule,
      active,
      action: () => {
        setActive(show => !show);
        setFilter([{ id: 'value', value: active }]);
      }
    }
  };
};

export const calcFullPathId = (row: Row<MappingTreeData>) => {
  return [...row.getParentRows().map(parent => parent.original.attribute), row.original.attribute].join('.');
};
