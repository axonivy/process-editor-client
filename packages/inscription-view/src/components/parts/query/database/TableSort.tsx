import { useEffect, useMemo, useState } from 'react';
import { useQueryData } from '../useQueryData';
import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { QUERY_ORDER } from '@axonivy/process-editor-inscription-protocol';
import { arraymove, indexOf } from '../../../../utils/array';
import { IvyIcons } from '@axonivy/ui-icons';
import {
  ReorderHandleWrapper,
  ReorderRow,
  SelectCell,
  Table,
  TableAddRow,
  TableBody,
  TableCell,
  TableResizableHeader
} from '@axonivy/ui-components';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import type { SelectItem } from '../../../widgets/select/Select';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { focusNewCell } from '../../common/table/cellFocus-utils';

type OrderDirection = keyof typeof QUERY_ORDER;

type Column = {
  name: string;
  sorting: OrderDirection;
};

const EMPTY_COLUMN: Column = { name: '', sorting: 'ASCENDING' };

export const TableSort = () => {
  const { config, updateSql } = useQueryData();
  const [data, setData] = useState<Column[]>([]);

  const { elementContext: context } = useEditorContext();
  const columnItems = useMeta('meta/database/columns', { context, database: config.query.dbName, table: config.query.sql.table }, []).data;
  const orderItems = useMemo<SelectItem[]>(() => Object.entries(QUERY_ORDER).map(([label, value]) => ({ label, value })), []);

  useEffect(() => {
    const data = config.query.sql.orderBy?.map<Column>(order => {
      const parts = order.split(' ');
      const name = parts[0];
      let sorting: OrderDirection = 'ASCENDING';
      if (parts.length > 1 && parts[1] === 'DESC') {
        sorting = 'DESCENDING';
      }
      return { name, sorting };
    });
    setData(data ?? []);
  }, [config.query.sql.orderBy]);

  const columns = useMemo<ColumnDef<Column, string>[]>(
    () => [
      {
        accessorKey: 'name',
        header: () => <span>Column</span>,
        cell: cell => <SelectCell cell={cell} items={columnItems.map(c => ({ label: c.name, value: c.name }))} />
      },
      {
        accessorKey: 'sorting',
        header: () => <span>Direction</span>,
        cell: cell => (
          <ReorderHandleWrapper>
            <SelectCell cell={cell} items={orderItems} />
          </ReorderHandleWrapper>
        )
      }
    ],
    [columnItems, orderItems]
  );

  const updateOrderBy = (data: Column[]) => {
    const orderBy = data.map(d => {
      let sorting = '';
      if (d.sorting === 'DESCENDING') {
        sorting = ' DESC';
      }
      return `${d.name}${sorting}`;
    });
    updateSql('orderBy', orderBy);
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection },
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData: (rowId: string, columnId: string, value: string) => {
        const rowIndex = parseInt(rowId);
        const newData = data.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...data[rowIndex]!,
              [columnId]: value
            };
          }
          return row;
        });
        updateOrderBy(newData);
      }
    }
  });

  const removeRow = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    if (newData.length === 0) {
      setRowSelection({});
    } else if (index === data.length - 1) {
      setRowSelection({ [`${newData.length - 1}`]: true });
    }
    updateOrderBy(newData);
  };

  const addRow = () => {
    const activeElement = document.activeElement;
    const domTable = activeElement?.parentElement?.previousElementSibling?.getElementsByTagName('table')[0];
    const newData = [...data];
    newData.push(EMPTY_COLUMN);
    setData(newData);
    setRowSelection({ [`${newData.length - 1}`]: true });
    focusNewCell(domTable, newData.length, 'button');
  };

  const updateOrder = (moveId: string, targetId: string) => {
    const fromIndex = indexOf(data, obj => obj.name === moveId);
    const toIndex = indexOf(data, obj => obj.name === targetId);
    arraymove(data, fromIndex, toIndex);
    updateOrderBy(data);
  };

  const tableActions =
    table.getSelectedRowModel().rows.length > 0
      ? [
          {
            label: 'Remove row',
            icon: IvyIcons.Trash,
            action: () => removeRow(table.getRowModel().rowsById[Object.keys(rowSelection)[0]].index)
          }
        ]
      : [];

  return (
    <PathCollapsible label='Sort' path='orderBy' defaultOpen={config.query.sql.orderBy?.length > 0} controls={tableActions}>
      <div>
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => setRowSelection({})} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <ReorderRow row={row} key={row.id} id={row.original.name} updateOrder={updateOrder}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </ReorderRow>
            ))}
          </TableBody>
        </Table>
        {columnItems.length !== table.getRowModel().rows.length && <TableAddRow addRow={addRow} />}
      </div>
    </PathCollapsible>
  );
};
