import { Checkbox as CheckboxPromitive, Field, Label } from '@axonivy/ui-components';
import type { ComponentPropsWithoutRef } from 'react';

type CheckboxProps = { label: string; value: boolean; onChange: (change: boolean) => void; disabled?: boolean } & Pick<
  ComponentPropsWithoutRef<typeof Field>,
  'style'
>;

const Checkbox = ({ label, value, onChange, disabled, style }: CheckboxProps) => (
  <Field direction='row' alignItems='center' gap={2} style={style}>
    <CheckboxPromitive checked={value} onCheckedChange={onChange} disabled={disabled} />
    <Label>{label}</Label>
  </Field>
);

export default Checkbox;
