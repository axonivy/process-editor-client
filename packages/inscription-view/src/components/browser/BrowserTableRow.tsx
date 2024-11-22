import { SelectRow, TableCell } from '@axonivy/ui-components';
import { flexRender, type Row } from '@tanstack/react-table';

const BrowserTableRow = <T,>({ row, onDoubleClick }: { row: Row<T>; onDoubleClick: () => void }) => (
  <SelectRow key={row.id} row={row} onDoubleClick={onDoubleClick}>
    {row.getVisibleCells().map(cell => (
      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
    ))}
  </SelectRow>
);

export default BrowserTableRow;
