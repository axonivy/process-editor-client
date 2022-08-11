import { Action, IActionDispatcher } from '@eclipse-glsp/client';
import { Menu } from '../../menu/menu';
import { ShowGridAction } from '../../../diagram/grid/action-handler';
import { SwitchThemeAction } from '../../../theme/action';
import { createElement, createIcon, ToggleSwitch } from '../../../utils/ui-utils';
import { CustomIconToggleAction, ShowToolBarOptionsMenuAction } from './action';

interface Option {
  icon: string;
  label: string;
  action: (state: boolean) => Action;
}

class ThemeOption implements Option {
  constructor(
    public readonly icon = 'si si-darkmode',
    public readonly label = 'Darkmode',
    public readonly action = (state: boolean) => SwitchThemeAction.create({ theme: state ? 'dark' : 'light' })
  ) {}
}

class GridOption implements Option {
  constructor(
    public readonly icon = 'si si-grid',
    public readonly label = 'Grid',
    public readonly action = (state: boolean) => ShowGridAction.create({ show: state })
  ) {}
}

class CustomIconOption implements Option {
  constructor(
    public readonly icon = 'si si-custom-icon',
    public readonly label = 'Custom Icon',
    public readonly action = (state: boolean) => CustomIconToggleAction.create({ showCustomIcons: state })
  ) {}
}

export class ToolBarOptionsMenu implements Menu {
  private bodyDiv?: HTMLDivElement;

  constructor(readonly actionDispatcher: IActionDispatcher, readonly showAction: ShowToolBarOptionsMenuAction) {}

  public create(containerElement: HTMLElement): HTMLElement {
    this.bodyDiv = createElement('div', ['tool-bar-options-menu']) as HTMLDivElement;
    containerElement.appendChild(this.bodyDiv);
    this.bodyDiv.appendChild(this.createHeader());
    this.bodyDiv.appendChild(this.createOptions());
    return this.bodyDiv;
  }

  createHeader(): HTMLElement {
    const header = createElement('div', ['tool-bar-options-header']);
    header.appendChild(createIcon(['fa-solid', 'fa-gear']));
    const label = document.createElement('label');
    label.textContent = 'Settings';
    header.appendChild(label);
    return header;
  }

  createOptions(): HTMLElement {
    const options = createElement('div', ['tool-bar-options']);
    if (this.showAction.theme) {
      options.appendChild(this.createOption(new ThemeOption(), this.showAction.theme() === 'dark'));
    }
    options.appendChild(this.createOption(new GridOption(), this.showAction.grid()));
    options.appendChild(this.createOption(new CustomIconOption(), this.showAction.customIconState()));
    return options;
  }

  createOption(setting: Option, state: boolean): HTMLElement {
    const option = createElement('div', ['tool-bar-option']);
    option.appendChild(createIcon([setting.icon]));
    const label = document.createElement('label');
    label.textContent = setting.label;
    option.appendChild(label);
    const toggle = new ToggleSwitch(state, newState => this.actionDispatcher.dispatch(setting.action(newState)));
    option.appendChild(toggle.create());
    label.onclick = _ev => toggle.switch();
    return option;
  }

  public remove(): void {
    this.bodyDiv?.remove();
  }
}
