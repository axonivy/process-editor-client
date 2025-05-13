import { BasicCheckbox } from '@axonivy/ui-components';
import type { ComponentProps } from 'react';

type CheckboxProps = Omit<ComponentProps<typeof BasicCheckbox>, 'value' | 'onChange'> & {
  value: boolean;
  onChange: (value: boolean) => void;
};

const Checkbox = ({ value, onChange, ...props }: CheckboxProps) => <BasicCheckbox checked={value} onCheckedChange={onChange} {...props} />;

export default Checkbox;
