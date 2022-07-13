import { EditLabelAction, isWithEditableLabel, SModelElement } from '@eclipse-glsp/client';
import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { KeyCode } from 'sprotty/lib/utils/keyboard';
import { injectable } from 'inversify';

@injectable()
export class EditLabelActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isWithEditableLabel(element) && element.editableLabel) {
      return new EditLabelQuickAction(element.editableLabel.id);
    }
    return undefined;
  }
}

class EditLabelQuickAction implements QuickAction {
  constructor(
    public readonly labelId: string,
    public readonly icon = 'fa-solid fa-tag',
    public readonly title = 'Edit Label (L)',
    public readonly location = QuickActionLocation.Middle,
    public readonly sorting = 'B',
    public readonly action = EditLabelAction.create(labelId),
    public readonly shortcut: KeyCode = 'KeyL'
  ) {}
}
