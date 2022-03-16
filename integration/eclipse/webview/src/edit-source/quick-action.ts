import { SModelElement } from '@eclipse-glsp/client';
import { QuickAction, QuickActionLocation, SingleQuickActionProvider, hasEditSourceFeature } from '@ivyteam/process-editor';
import { injectable } from 'inversify';
import { KeyCode } from 'sprotty/lib/utils/keyboard';
import { EditSourceAction } from './action';

@injectable()
export class EditSourceQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (hasEditSourceFeature(element)) {
      return new EditSourceQuickAction(element.id);
    }
    return undefined;
  }
}

class EditSourceQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = 'fa-edit',
    public readonly title = 'Edit (E)',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'B',
    public readonly action = new EditSourceAction(elementId),
    public readonly readonlySupport = true,
    public readonly shortcut: KeyCode = 'KeyE'
  ) {}
}
