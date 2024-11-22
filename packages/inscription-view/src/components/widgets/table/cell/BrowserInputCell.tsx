import type { CellContext } from '@tanstack/react-table';
import { Input } from '../../input';
import { Browser, useBrowser } from '../../../browser';
import { usePath } from '../../../../context';
import { Flex, useEditCell } from '@axonivy/ui-components';

type BrowserInputCellProps<TData> = {
  cell: CellContext<TData, string>;
};

export function BrowserInputCell<TData>({ cell }: BrowserInputCellProps<TData>) {
  const { value, setValue, updateValue, onBlur, className: editCell } = useEditCell(cell);
  const browser = useBrowser();
  const path = usePath();

  return (
    <Flex direction='row' justifyContent='space-between' alignItems='center'>
      <Input value={value} onChange={change => setValue(change)} onBlur={onBlur} title={value} className={editCell} />
      {cell.row.getIsSelected() && (
        <Browser {...browser} types={['type']} accept={change => updateValue(change.cursorValue)} location={path} />
      )}
    </Flex>
  );
}
