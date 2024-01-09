import { isOpenable, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { IvyIcons } from '@axonivy/editor-icons/lib';
import { QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { OpenSwtInscriptionAction } from '@axonivy/process-editor-protocol';

@injectable()
export class InscribeQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isOpenable(element)) {
      return {
        icon: IvyIcons.Edit,
        title: 'Edit (E)',
        location: 'Left',
        sorting: 'B',
        action: OpenSwtInscriptionAction.create(element.id),
        readonlySupport: true,
        shortcut: 'KeyE'
      };
    }
    return undefined;
  }
}
