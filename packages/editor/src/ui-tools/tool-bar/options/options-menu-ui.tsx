import { IActionDispatcher, ShowGridAction } from '@eclipse-glsp/client';
import { Menu } from '../../menu/menu';
import { h } from '../../../utils/ui-utils';
import { ShowToolBarOptionsMenuAction } from './action';
import { IvyIcons } from '@axonivy/ui-icons';
import { CustomIconToggleAction, SwitchThemeAction } from '@axonivy/process-editor-protocol';
import { ToggleSwitch } from '../../../utils/ToggleSwitch';
import { IvyIcon } from '../../../utils/IvyIcon';

const JSX = { createElement: h };

export class ToolBarOptionsMenu implements Menu {
  private bodyDiv: HTMLElement;

  constructor(readonly actionDispatcher: IActionDispatcher, readonly showAction: ShowToolBarOptionsMenuAction) {}

  public create(containerElement: HTMLElement): HTMLElement {
    const optionsBtn = document.querySelector<HTMLDivElement>('#btn_options_menu');
    const containerWidth = containerElement.offsetWidth;
    let buttonCenter = 0;
    if (optionsBtn) {
      buttonCenter = optionsBtn.offsetLeft + optionsBtn.offsetWidth / 2;
    }
    this.bodyDiv = (
      <div className='tool-bar-options-menu' style={{ '--menu-arrow-pos': `${containerWidth - buttonCenter - 15}px` }}>
        <Header />
        <Options action={this.showAction} actionDispatcher={this.actionDispatcher} />
      </div>
    );
    containerElement.appendChild(this.bodyDiv);
    return this.bodyDiv;
  }

  public remove(): void {
    this.bodyDiv?.remove();
  }
}

const Header = (): HTMLElement => (
  <div className='tool-bar-options-header'>
    <IvyIcon icon={IvyIcons.Settings} />
    <label>Options</label>
  </div>
);

const Options = ({
  action,
  actionDispatcher
}: {
  action: ShowToolBarOptionsMenuAction;
  actionDispatcher: IActionDispatcher;
}): HTMLElement => (
  <div className='tool-bar-options'>
    {action.theme ? (
      <ToggleSwitch
        icon={IvyIcons.DarkMode}
        label='Darkmode'
        defaultValue={action.theme() === 'dark'}
        onclick={state => actionDispatcher.dispatch(SwitchThemeAction.create({ theme: state ? 'dark' : 'light' }))}
      />
    ) : null}
    <ToggleSwitch
      icon={IvyIcons.GridDots}
      label='Grid'
      defaultValue={action.grid()}
      onclick={state => actionDispatcher.dispatch(ShowGridAction.create({ show: state }))}
    />
    <ToggleSwitch
      icon={IvyIcons.CustomImage}
      label='Custom Icon'
      defaultValue={action.customIconState()}
      onclick={state => actionDispatcher.dispatch(CustomIconToggleAction.create({ showCustomIcons: state }))}
    />
  </div>
);
