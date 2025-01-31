import { injectable } from 'inversify';
import { ToolBarButtonLocation, type ToolBarButtonProvider } from '../ui-tools/tool-bar/button';
import { OpenDataClassAction } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { t } from 'i18next';

@injectable()
export class OpenDataClassButtonProvider implements ToolBarButtonProvider {
  button() {
    return {
      icon: IvyIcons.DatabaseLink,
      title: t('toolbar.openDataClass', { hotkey: 'C' }),
      id: 'btn_open_data_class',
      sorting: 'E',
      action: () => OpenDataClassAction.create(),
      location: ToolBarButtonLocation.Right,
      readonly: true
    };
  }
}
