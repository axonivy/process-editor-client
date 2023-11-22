import { ToolBarButton, ToolBarButtonLocation, ToolBarButtonProvider } from '@axonivy/process-editor';
import { ToggleInscriptionAction } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/editor-icons/lib';
import { injectable } from 'inversify';

@injectable()
export class InscriptionButtonProvider implements ToolBarButtonProvider {
  button(): ToolBarButton {
    return new InscriptionToolButton();
  }
}

export class InscriptionToolButton implements ToolBarButton {
  constructor(
    public readonly icon = IvyIcons.LayoutSidebarRightCollapse,
    public readonly title = 'Inscription',
    public readonly sorting = 'Z',
    public readonly action = () => ToggleInscriptionAction.create(),
    public readonly id = 'btn_inscription_toggle',
    public readonly location = ToolBarButtonLocation.Right
  ) {}
}
