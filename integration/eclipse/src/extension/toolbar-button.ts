import { ToolBarButtonProvider, ToolBarButtonLocation } from '@axonivy/process-editor';
import { OpenInsertExtensionAction } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { injectable } from 'inversify';

@injectable()
export class OpenInsertExtensionButtonProvider implements ToolBarButtonProvider {
  button() {
    return {
      icon: IvyIcons.Extension,
      title: 'Extensions',
      sorting: 'F',
      action: () => OpenInsertExtensionAction.create(),
      id: 'insertextensionbutton',
      location: ToolBarButtonLocation.Middle,
      switchFocus: true,
      showTitle: true,
      isNotMenu: true
    };
  }
}
