import './Table.css';
import { forwardRef, type ComponentPropsWithRef } from 'react';
import { Flex, Table } from '@axonivy/ui-components';
import SearchInput from '../../input/SearchInput';
import { useTranslation } from 'react-i18next';

type TableProps = ComponentPropsWithRef<typeof Table> & {
  search?: { value: string; onChange: (value: string) => void };
};

export const SearchTable = forwardRef<HTMLTableElement, TableProps>(({ search, ...props }, forwardRef) => {
  const { t } = useTranslation();
  return (
    <Flex direction='column' gap={1}>
      {search && <SearchInput placeholder={t('common:label.search')} {...search} />}
      <Table ref={forwardRef} {...props} />
    </Flex>
  );
});
