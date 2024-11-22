import type { StartCustomStartField } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { memo, useMemo } from 'react';
import { MacroCell, type ComboboxItem } from '../../../widgets';
import { useAction, useEditorContext, useMeta } from '../../../../context';
import { ValidationRow } from '../path/validation/ValidationRow';
import { PathCollapsible } from '../path/PathCollapsible';
import { useResizableEditableTable } from '../table/useResizableEditableTable';
import { ComboCell, SortableHeader, Table, TableBody, TableCell, TableResizableHeader } from '@axonivy/ui-components';

type StartCustomFieldTableProps = {
  data: StartCustomStartField[];
  onChange: (change: StartCustomStartField[]) => void;
};

const EMPTY_STARTCUSTOMSTARTFIELD: StartCustomStartField = { name: '', value: '' } as const;

const StartCustomFieldTable = ({ data, onChange }: StartCustomFieldTableProps) => {
  const { context } = useEditorContext();
  const predefinedCustomField: ComboboxItem[] = useMeta(
    'meta/workflow/customFields',
    { context, type: 'START' },
    []
  ).data.map<ComboboxItem>(pcf => ({
    value: pcf.name
  }));

  const columns = useMemo<ColumnDef<StartCustomStartField, string>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} name='Name' />,
        cell: cell => <ComboCell cell={cell} options={predefinedCustomField.filter(pcf => !data.find(d => d.name === pcf.value))} />
      },
      {
        accessorKey: 'value',
        header: ({ column }) => <SortableHeader column={column} name='Expression' />,
        cell: cell => <MacroCell cell={cell} placeholder={'Enter an Expression'} />
      }
    ],
    [data, predefinedCustomField]
  );

  const { table, rowSelection, setRowSelection, removeRowAction, showAddButton } = useResizableEditableTable({
    data,
    columns,
    onChange,
    emptyDataObject: EMPTY_STARTCUSTOMSTARTFIELD
  });

  const action = useAction('openCustomField');

  const tableActions =
    table.getSelectedRowModel().rows.length > 0
      ? [
          {
            label: 'Open custom field configuration',
            icon: IvyIcons.GoToSource,
            action: () => action({ name: table.getRowModel().rowsById[Object.keys(rowSelection)[0]].original.name, type: 'START' })
          },
          removeRowAction
        ]
      : [];

  return (
    <PathCollapsible path='customFields' controls={tableActions} label='Custom Fields' defaultOpen={data.length > 0}>
      <div>
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => setRowSelection({})} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <ValidationRow row={row} key={row.id} rowPathSuffix={row.original.name}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </ValidationRow>
            ))}
          </TableBody>
        </Table>
        {showAddButton()}
      </div>
    </PathCollapsible>
  );
};

export default memo(StartCustomFieldTable);
