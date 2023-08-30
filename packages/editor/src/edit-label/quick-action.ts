import { EditLabelAction, isWithEditableLabel, SModelElement } from '@eclipse-glsp/client';
import { QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { injectable } from 'inversify';
import { StreamlineIcons } from '../StreamlineIcons';

@injectable()
export class EditLabelActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isWithEditableLabel(element) && element.editableLabel) {
      return {
        icon: StreamlineIcons.Label,
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
