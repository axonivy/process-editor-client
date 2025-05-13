import { type ComponentProps } from 'react';
import { BasicInput } from '@axonivy/ui-components';

export type InputProps = Omit<ComponentProps<typeof BasicInput>, 'onChange'> & {
  onChange: (change: string) => void;
};

export const Input = ({ onChange, ...props }: InputProps) => <BasicInput onChange={e => onChange(e.target.value)} {...props} />;
