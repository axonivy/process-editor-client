import { GModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { OpenDecoratorBrowserAction } from '@axonivy/process-editor-protocol';
import { QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { isWithCustomIcon } from '../diagram/icon/model';
import { ActivityTypes } from '../diagram/view-types';
import { IvyIcons } from '@axonivy/ui-icons';

@injectable()
export class CustomIconQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (isWithCustomIcon(element) && element.type !== ActivityTypes.COMMENT) {
      return {
        icon: IvyIcons.CustomImage,
        title: 'Custom Icon',
        location: 'Middle',
        sorting: 'C',
        action: OpenDecoratorBrowserAction.create(element.id)
      };
    }
    return undefined;
  }
}
