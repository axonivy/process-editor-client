import { GModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { GoToSourceAction } from '@axonivy/process-editor-protocol';
import { QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { hasGoToSourceFeature } from '../jump/model';
import { IvyIcons } from '@axonivy/ui-icons';

@injectable()
export class GoToSourceQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (hasGoToSourceFeature(element)) {
      return {
        icon: IvyIcons.GoToSource,
        title: 'Go To Source (S)',
        location: 'Middle',
        sorting: 'B',
        action: GoToSourceAction.create(element.id),
        readonlySupport: true,
        shortcut: 'KeyS'
      };
    }
    return undefined;
  }
}
