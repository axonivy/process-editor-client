import type { DataclassType } from '@axonivy/process-editor-inscription-protocol';
import type { ComboboxItem } from '../../widgets';
import { Combobox, IvyIcon } from '../../widgets';
import { IvyIcons } from '@axonivy/ui-icons';

export type DataClassItem = Pick<DataclassType, 'name' | 'packageName' | 'path'> & ComboboxItem;

type DataClassSelectorProps = {
  dataClass: string;
  onChange: (change: string) => void;
  dataClasses: DataClassItem[];
};

const DataClassSelector = ({ dataClass, onChange, dataClasses }: DataClassSelectorProps) => {
  const comboboxItem = (item: DataClassItem) => {
    const tooltip = `${item.name} ${item.packageName ? `${item.packageName} - ${item.path}` : ''}`;
    return (
      <>
        <div title={tooltip} aria-label={tooltip}>
          <IvyIcon icon={IvyIcons.DataClass} />
          <span>{item.name}</span>
          {item.packageName && <span className='combobox-menu-entry-additional'>{`${item.packageName} - ${item.path}`}</span>}
        </div>
      </>
    );
  };

  return <Combobox value={dataClass} onChange={onChange} items={dataClasses} comboboxItem={comboboxItem} />;
};

export default DataClassSelector;
