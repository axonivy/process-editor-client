import { IvyIcons } from '@axonivy/ui-icons';
import { h } from './ui-utils';

const JSX = { createElement: h };

export const IvyIcon = ({ icon, className }: { icon?: IvyIcons; className?: string }): HTMLElement => (
  <i className={`ivy ivy-${icon} ${className}`} />
);
