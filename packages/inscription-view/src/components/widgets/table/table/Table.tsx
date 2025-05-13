import './Table.css';
import { type ComponentProps } from 'react';
import { Flex, Table } from '@axonivy/ui-components';
import SearchInput from '../../input/SearchInput';
import { useTranslation } from 'react-i18next';

type TableProps = ComponentProps<typeof Table> & {
  search?: { value: string; onChange: (value: string) => void };
};

export const SearchTable = ({ search, ...props }: TableProps) => {
  const { t } = useTranslation();
  return (
    <Flex direction='column' gap={1}>
      {search && <SearchInput placeholder={t('common.label.search')} {...search} />}
      <Table {...props} />
    </Flex>
  );
};
