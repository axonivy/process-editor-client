import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { ColumnDef, ColumnFiltersState, ExpandedState, RowSelectionState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { MappingTreeData } from './mapping-tree-data';
import { ExpandableCell, ScriptCell, SearchTable } from '../../../../components/widgets';
import type { MappingPartProps } from './MappingPart';
import type { TableFilter } from './useMappingTree';
import { calcFullPathId } from './useMappingTree';
import { ValidationRow } from '../path/validation/ValidationRow';
import { ExpandableHeader, TableBody, TableCell, TableResizableHeader } from '@axonivy/ui-components';

type MappingTreeProps = MappingPartProps & {
  globalFilter: TableFilter<string>;
  onlyInscribedFilter: TableFilter<ColumnFiltersState>;
};

const MappingTree = ({ data, variableInfo, onChange, globalFilter, onlyInscribedFilter, browsers }: MappingTreeProps) => {
  const [tree, setTree] = useState<MappingTreeData[]>([]);

  useEffect(() => {
    const treeData = MappingTreeData.of(variableInfo);
    Object.entries(data).forEach(mapping => MappingTreeData.update(variableInfo, treeData, mapping[0].split('.'), mapping[1]));
    setTree(treeData);
  }, [data, variableInfo]);

  const loadChildren = useCallback<(row: MappingTreeData) => void>(
    row => setTree(tree => MappingTreeData.loadChildrenFor(variableInfo, row.type, tree)),
    [variableInfo, setTree]
  );

  const columns = useMemo<ColumnDef<MappingTreeData, string>[]>(
    () => [
      {
        accessorFn: row => row.attribute,
        id: 'attribute',
        header: header => <ExpandableHeader header={header} name='Attribute' />,
        cell: cell => (
          <ExpandableCell
            cell={cell}
            isLoaded={cell.row.original.isLoaded}
            loadChildren={() => loadChildren(cell.row.original)}
            isUnknown={cell.row.original.type.length === 0}
            title={cell.row.original.description}
          />
        ),
        size: 100,
        minSize: 60
      },
      {
        accessorFn: row => row.value,
        id: 'value',
        header: () => <span>Expression</span>,
        cell: cell => <ScriptCell cell={cell} type={cell.row.original.type} browsers={browsers} placeholder={cell.row.original.type} />,
        filterFn: (row, columnId, filterValue) => filterValue || row.original.value.length > 0
      }
    ],
    [browsers, loadChildren]
  );

  const [expanded, setExpanded] = useState<ExpandedState>(true);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data: tree,
    columns: columns,
    state: {
      expanded,
      rowSelection,
      globalFilter: globalFilter.filter,
      columnFilters: onlyInscribedFilter.filter
    },
    filterFromLeafRows: true,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: globalFilter.setFilter,
    onColumnFiltersChange: onlyInscribedFilter.setFilter,
    getSubRows: row => row.children,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      updateData: (rowId: string, columnId: string, value: string) => {
        const rowIndex = rowId.split('.').map(parseFloat);
        onChange(MappingTreeData.to(MappingTreeData.updateDeep(tree, rowIndex, columnId, value)));
      }
    }
  });

  return (
    <SearchTable search={globalFilter.active ? { value: globalFilter.filter, onChange: globalFilter.setFilter } : undefined}>
      <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => setRowSelection({})} />
      <TableBody>
        {table.getRowModel().rows.map(row => (
          <ValidationRow row={row} key={row.id} rowPathSuffix={calcFullPathId(row)}>
            {row.getVisibleCells().map(cell => (
              <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </ValidationRow>
        ))}
      </TableBody>
    </SearchTable>
  );
};

export default memo(MappingTree);
