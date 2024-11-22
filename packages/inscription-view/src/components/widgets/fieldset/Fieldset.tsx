import { memo } from 'react';
import type { FieldsetControl } from './fieldset-control';
import { ButtonGroup, Fieldset as Field, type FieldsetProps as FieldProps } from '@axonivy/ui-components';
import { toMessageData, type ValidationMessage } from '../message/Message';

export type FieldsetProps = Omit<FieldProps, 'message' | 'control'> & {
  controls?: Array<FieldsetControl>;
  validation?: ValidationMessage;
};

const Controls = ({ controls }: Pick<FieldsetProps, 'controls'>) => {
  if (controls) {
    return (
      <ButtonGroup
        controls={controls.map(({ action, icon, label, active }) => ({
          icon,
          title: label,
          onClick: action,
          toggle: active,
          'aria-label': label
        }))}
      />
    );
  }
  return null;
};

const Fieldset = ({ label, controls, validation, ...props }: FieldsetProps) => {
  return <Field label={label} message={toMessageData(validation)} control={<Controls controls={controls} />} {...props} />;
};

export default memo(Fieldset);
