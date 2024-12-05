import { useRestRequestData } from '../../useRestRequestData';
import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { IvyIcons } from '@axonivy/ui-icons';
import { useEffect, useMemo, useState } from 'react';
import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { useRestResourceMeta } from '../../useRestResourceMeta';
import type { RestParam } from './rest-parameter';
import { restParamBuilder, toRestMap, updateRestParams } from './rest-parameter';
import { deepEqual } from '../../../../../utils/equals';
import { InputCell, SortableHeader, Table, TableAddRow, TableBody, TableCell, TableResizableHeader } from '@axonivy/ui-components';
import { PathContext } from '../../../../../context/usePath';
import Fieldset from '../../../../widgets/fieldset/Fieldset';
import { ValidationRow } from '../../../common/path/validation/ValidationRow';
import { ScriptCell } from '../../../../widgets/table/cell/ScriptCell';

const EMPTY_PARAMETER: RestParam = { name: '', expression: '', known: false };

export const RestForm = () => {
  const { config, updateBody } = useRestRequestData();

  const [data, setData] = useState<RestParam[]>([]);
  const restResource = useRestResourceMeta();

  useEffect(() => {
    const restResourceParam = restResource.method?.inBody.type;
    const params = restParamBuilder().openApiParam(restResourceParam).restMap(config.body.form).build();
    setData(params);
  }, [restResource.method?.inBody.type, config.body.form]);

  const onChange = (params: RestParam[]) => updateBody('form', toRestMap(params));

  const columns = useMemo<ColumnDef<RestParam, string>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} name='Name' />,
        cell: cell => <InputCell cell={cell} disabled={cell.row.original.known} />
      },
      {
        accessorKey: 'expression',
        header: ({ column }) => <SortableHeader column={column} name='Expression' />,
        cell: cell => (
          <ScriptCell
            placeholder={cell.row.original.type}
            cell={cell}
            type={cell.row.original.type ?? IVY_SCRIPT_TYPES.OBJECT}
            browsers={['attr', 'func', 'type', 'cms']}
          />
        )
      }
    ],
    []
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const showAddButton = () => {
    return data.filter(obj => deepEqual(obj, EMPTY_PARAMETER)).length === 0;
  };

  const addRow = () => {
    const newData = [...data];
    newData.push(EMPTY_PARAMETER);
    onChange(newData);
    setRowSelection({ [`${newData.length - 1}`]: true });
  };

  const removeRow = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    if (newData.length === 0) {
      setRowSelection({});
    } else if (index === data.length - 1) {
      setRowSelection({ [`${newData.length - 1}`]: true });
    }
    onChange(newData);
  };

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
        onChange(updateRestParams(data, rowIndex, columnId, value));
      }
    }
  });

  const showTableActions =
    table.getSelectedRowModel().rows.length > 0 && !table.getRowModel().rowsById[Object.keys(rowSelection)[0]].original.known;

  const tableActions = showTableActions
    ? [
        {
          label: 'Remove row',
          icon: IvyIcons.Trash,
          action: () => removeRow(table.getRowModel().rowsById[Object.keys(rowSelection)[0]].index)
        }
      ]
    : [];

  return (
    <PathContext path='form'>
      <div>
        {showTableActions && <Fieldset label=' ' controls={tableActions} />}
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => setRowSelection({})} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <ValidationRow row={row} key={row.id} rowPathSuffix={row.original.name} title={row.original.doc}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </ValidationRow>
            ))}
          </TableBody>
        </Table>
        {showAddButton() && <TableAddRow addRow={addRow} />}
      </div>
    </PathContext>
  );
};
