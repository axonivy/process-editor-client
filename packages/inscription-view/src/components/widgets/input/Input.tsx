import { forwardRef, useEffect, useState } from 'react';
import { Input as InputPrimitive, type InputProps as InputPrimitiveProps } from '@axonivy/ui-components';

export type InputProps = Omit<InputPrimitiveProps, 'value' | 'onChange' | 'ref'> & {
  value?: string;
  onChange: (change: string) => void;
};

const Input = forwardRef<HTMLInputElement, InputProps>(({ value, onChange, ...props }, forwardedRef) => {
  const [currentValue, setCurrentValue] = useState(value ?? '');
  useEffect(() => {
    setCurrentValue(value ?? '');
  }, [value]);
  const updateValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const update = event.target.value;
    setCurrentValue(update);
    onChange(update);
  };
  return <InputPrimitive ref={forwardedRef} value={currentValue} onChange={updateValue} {...props} />;
});

export default Input;
