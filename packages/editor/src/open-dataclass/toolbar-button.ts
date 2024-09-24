import { injectable } from 'inversify';
import { ToolBarButtonLocation, ToolBarButtonProvider } from '../ui-tools/tool-bar/button';
import { OpenDataClassAction } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';

@injectable()
export class OpenDataClassButtonProvider implements ToolBarButtonProvider {
  button() {
    return {
      icon: IvyIcons.DatabaseLink,
      title: 'Open Data Class (C)',
      sorting: 'E',
      action: () => OpenDataClassAction.create(),
      location: ToolBarButtonLocation.Right,
      readonly: true
    };
  }
}
