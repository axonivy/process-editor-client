import { isOpenable, OpenAction, SModelElement } from '@eclipse-glsp/client';
import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '@ivyteam/process-editor';
import { injectable } from 'inversify';

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
    public readonly icon = 'fa-pen',
    public readonly title = 'Edit',
    public readonly location = QuickActionLocation.TopLeft,
    public readonly sorting = 'B',
    public readonly action = new OpenAction(elementId)
  ) {}
}
