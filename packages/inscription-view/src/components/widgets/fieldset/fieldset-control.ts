import type { IvyIcons } from '@axonivy/ui-icons';

export interface FieldsetControl {
  label: string;
  icon: IvyIcons;
  active?: boolean;
  action: () => void;
}
