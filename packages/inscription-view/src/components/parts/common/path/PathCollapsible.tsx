import type { ReactNode } from 'react';
import type { CollapsibleProps } from '../../../widgets/collapsible/Collapsible';
import type { SchemaKeys } from '@axonivy/process-editor-inscription-protocol';
import { ValidationCollapsible } from './validation/ValidationCollapsible';
import { PathContext } from '../../../../context/usePath';

export type PathCollapsibleProps = CollapsibleProps & {
  path: SchemaKeys;
  children: ReactNode;
};

export const PathCollapsible = ({ path: location, children, ...props }: PathCollapsibleProps) => (
  <PathContext path={location}>
    <ValidationCollapsible {...props}>{children}</ValidationCollapsible>
  </PathContext>
);
