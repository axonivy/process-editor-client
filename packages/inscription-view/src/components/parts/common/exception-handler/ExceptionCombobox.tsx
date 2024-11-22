import type { ComboboxProps } from '../../../widgets';
import { Combobox, IvyIcon } from '../../../widgets';
import type { IvyIcons } from '@axonivy/ui-icons';

type ExceptionComboboxProps = Omit<ComboboxProps<ExceptionItem>, 'itemFilter' | 'comboboxItem'> & {
  items: ExceptionItem[];
};

export type ExceptionItem = {
  value: string;
  label: string;
  icon?: IvyIcons;
  info?: string;
};

export const ExceptionCombobox = ({ value, onChange, items, ...props }: ExceptionComboboxProps) => {
  const comboboxItem = (item: ExceptionItem) => {
    const tooltip = `${item.label}${item.info ? ` - ${item.info}` : ''}`;
    return (
      <>
        <div title={tooltip} aria-label={tooltip}>
          {item.icon && <IvyIcon icon={item.icon} />}
          <span>{item.label}</span>
          {item.info && <span className='combobox-menu-entry-additional'>{` - ${item.info}`}</span>}
        </div>
      </>
    );
  };

  return <Combobox items={items} value={value} comboboxItem={comboboxItem} onChange={onChange} {...props} />;
};
