import { IvyIcons } from '@axonivy/ui-icons';
import { IvyIcon } from './IvyIcon';
import './ToggleSwitch.css';
import { h } from './ui-utils';

const JSX = { createElement: h };

interface ToggleSwitchProps {
  icon: IvyIcons;
  label: string;
  defaultValue: boolean;
  onclick: (state: boolean) => void;
}

export const ToggleSwitch = ({ icon, label, defaultValue, onclick }: ToggleSwitchProps): HTMLElement => (
  <label className='toggle-switch'>
    <IvyIcon icon={icon} />
    <span>{label}</span>
    <div className='switch'>
      <input type='checkbox' defaultChecked={defaultValue} onchange={event => onclick((event.target as HTMLInputElement).checked)} />
      <span className='slider round' />
    </div>
  </label>
);
