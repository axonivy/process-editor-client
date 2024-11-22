import { SimpleSelect } from '@axonivy/ui-components';
import { memo } from 'react';

export type SelectItem = {
  label: string;
  value: string;
};

export const EMPTY_SELECT_ITEM: SelectItem = { label: '', value: '' };

export type SelectProps = {
  value?: SelectItem;
  onChange: (value: SelectItem) => void;
  items: SelectItem[];
  emptyItem?: boolean;
  disabled?: boolean;
};

const Select = ({ value, onChange, items, emptyItem, disabled }: SelectProps) => {
  const onValueChange = (change: string) => {
    const item = items.find(({ value }) => value === change);
    onChange(item ?? EMPTY_SELECT_ITEM);
  };

  return <SimpleSelect value={value?.value} onValueChange={onValueChange} items={items} emptyItem={emptyItem} disabled={disabled} />;
};

export default memo(Select);
