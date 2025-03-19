import { BasicSelect } from '@axonivy/ui-components';
import { memo } from 'react';

export type SelectItem<T = string> = {
  label: string;
  value: T;
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

  return <BasicSelect value={value?.value} onValueChange={onValueChange} items={items} emptyItem={emptyItem} disabled={disabled} />;
};

export default memo(Select);
