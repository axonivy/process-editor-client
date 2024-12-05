import type { Document } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { memo, useMemo } from 'react';
import { useResizableEditableTable } from '../../common/table/useResizableEditableTable';
import { InputCell, SelectRow, SortableHeader, Table, TableBody, TableCell, TableResizableHeader } from '@axonivy/ui-components';
import { useAction } from '../../../../context/useAction';
import Collapsible from '../../../widgets/collapsible/Collapsible';

const EMPTY_DOCUMENT: Document = { name: '', url: '' } as const;

const DocumentTable = ({ data, onChange }: { data: Document[]; onChange: (change: Document[]) => void }) => {
  const columns = useMemo<ColumnDef<Document, string>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} name='Name' />,
        cell: cell => <InputCell cell={cell} placeholder={'Enter a Name'} />
      },
      {
        accessorFn: row => row.url,
        id: 'url',
        header: ({ column }) => <SortableHeader column={column} name='URL' />,
        cell: cell => <InputCell cell={cell} placeholder={'Enter a URL'} />
      }
    ],
    []
  );

  const { table, rowSelection, setRowSelection, removeRowAction, showAddButton } = useResizableEditableTable({
    data,
    columns,
    onChange,
    emptyDataObject: EMPTY_DOCUMENT
  });

  const action = useAction('openPage');

  const tableActions =
    table.getSelectedRowModel().rows.length > 0
      ? [
          { label: 'Browse', icon: IvyIcons.Search, action: () => {} },
          {
            label: 'Open URL',
            icon: IvyIcons.GoToSource,
            action: () => action(table.getRowModel().rowsById[Object.keys(rowSelection)[0]].original.url)
          },
          removeRowAction
        ]
      : [];

  return (
    <Collapsible label='Means / Documents' controls={tableActions} defaultOpen={data !== undefined && data.length > 0}>
      <div>
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => setRowSelection({})} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <SelectRow key={row.id} row={row}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </SelectRow>
            ))}
          </TableBody>
        </Table>
        {showAddButton()}
      </div>
    </Collapsible>
  );
};

export default memo(DocumentTable);
