import type { ReactNode } from 'react';
import type { FieldsetProps } from '../../../widgets/fieldset/Fieldset';
import type { SchemaKeys } from '@axonivy/process-editor-inscription-protocol';
import { ValidationFieldset } from './validation/ValidationFieldset';
import { PathContext } from '../../../../context/usePath';

export type PathFieldsetProps = FieldsetProps & {
  path: SchemaKeys;
  children: ReactNode;
};

export const PathFieldset = ({ path: location, children, ...props }: PathFieldsetProps) => (
  <PathContext path={location}>
    <ValidationFieldset {...props}>{children}</ValidationFieldset>
  </PathContext>
);
