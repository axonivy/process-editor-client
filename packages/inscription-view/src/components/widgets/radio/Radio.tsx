import type { RadioGroupProps } from '@radix-ui/react-radio-group';
import { RadioGroup, RadioGroupItem, Label, Field } from '@axonivy/ui-components';

export type RadioItemProps<T> = { value: T; label: string; description?: string };

type RadioProps<T extends string> = Omit<RadioGroupProps, 'value' | 'onChange'> & {
  value: T;
  onChange: (change: T) => void;
  items: RadioItemProps<T>[];
};

const Radio = <T extends string>({ value, onChange, items, orientation = 'vertical', ...props }: RadioProps<T>) => {
  return (
    <RadioGroup value={value} onValueChange={onChange} orientation={orientation} {...props}>
      {items.map((item, index) => (
        <RadioItem key={`${index}-${item.value}`} {...item} />
      ))}
    </RadioGroup>
  );
};

const RadioItem = <T extends string>({ label, value, description }: RadioItemProps<T>) => {
  return (
    <Field direction='row' alignItems='center' gap={2}>
      <RadioGroupItem value={value} />
      <Label aria-label={label}>
        {label}
        <i>{description ? ` : ${description}` : ''}</i>
      </Label>
    </Field>
  );
};

export default Radio;
