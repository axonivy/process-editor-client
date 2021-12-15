import { SModelElement } from '@eclipse-glsp/client';
import {
  QuickAction,
  QuickActionLocation,
  SingleQuickActionProvider,
  isWithCustomIcon,
  WithCustomIcon,
  ActivityTypes
} from '@ivyteam/process-editor';
import { injectable } from 'inversify';
import { OpenDecoratorBrowserAction } from './action';

@injectable()
export class CustomIconQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isWithCustomIcon(element) && element.type !== ActivityTypes.COMMENT) {
      return new CustomIconQuickAction(element.id, this.isCustomIconSet(element));
    }
    return undefined;
  }

  private isCustomIconSet(element: WithCustomIcon): boolean {
    return element.icon !== element.customIcon;
  }
}

class CustomIconQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly customIconSet: boolean,
    public readonly icon = 'fa-image',
    public readonly title = 'Custom Icon',
    public readonly location = QuickActionLocation.TopLeft,
    public readonly sorting = 'C',
    public readonly action = new OpenDecoratorBrowserAction(elementId, customIconSet)
  ) {}
}
