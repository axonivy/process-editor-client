import { isOpenable, SModelElement } from '@eclipse-glsp/client';
import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '@ivyteam/process-editor';
import { injectable } from 'inversify';
import { OpenAction } from 'sprotty-protocol';
import { KeyCode } from 'sprotty/lib/utils/keyboard';

@injectable()
export class InscribeQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isOpenable(element)) {
      return new InscribeQuickAction(element.id);
    }
    return undefined;
  }
}

class InscribeQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = 'si si-settings',
    public readonly title = 'Edit (E)',
    public readonly location = QuickActionLocation.Left,
    public readonly sorting = 'B',
    public readonly action = OpenAction.create(elementId),
    public readonly readonlySupport = true,
    public readonly shortcut: KeyCode = 'KeyE'
  ) {}
}
