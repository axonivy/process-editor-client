import { EditLabelAction, isWithEditableLabel, GModelElement } from '@eclipse-glsp/client';
import { QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { injectable } from 'inversify';
import { IvyIcons } from '@axonivy/editor-icons/lib';

@injectable()
export class EditLabelActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (isWithEditableLabel(element) && element.editableLabel) {
      return {
        icon: IvyIcons.Label,
        title: 'Edit Label (L)',
        location: 'Middle',
        sorting: 'B',
        action: EditLabelAction.create(element.editableLabel.id),
        shortcut: 'KeyL'
      };
    }
    return undefined;
  }
}