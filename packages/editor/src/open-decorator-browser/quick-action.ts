import { GModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { OpenDecoratorBrowserAction } from '@axonivy/process-editor-protocol';
import { type QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { isWithCustomIcon } from '../diagram/icon/model';
import { ActivityTypes } from '../diagram/view-types';
import { IvyIcons } from '@axonivy/ui-icons';
import { t } from 'i18next';

@injectable()
export class CustomIconQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (isWithCustomIcon(element) && element.type !== ActivityTypes.COMMENT) {
      return {
        icon: IvyIcons.CustomImage,
        title: t('quickAction.customIcon'),
        location: 'Middle',
        sorting: 'C',
        action: OpenDecoratorBrowserAction.create(element.id),
        letQuickActionsOpen: true
      };
    }
    return undefined;
  }
}
