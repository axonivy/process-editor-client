import { Action, GLSPActionDispatcher, PaletteItem, GModelElement, TYPES } from '@eclipse-glsp/client';
import { QuickAction, SingleQuickActionProvider } from '../quick-action';
import { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { injectable, inject } from 'inversify';
import { IVY_TYPES } from '../../../types';
import { TypesPaletteHandler } from './action-handler';
import { isUnwrapable } from '../../../wrap/model';
import { IvyIcons } from '@axonivy/ui-icons';
import { ChangeActivityTypeOperation } from '@axonivy/process-editor-protocol';

@injectable()
export class SelectActivityTypeQuickActionProvider extends SingleQuickActionProvider {
  @inject(IVY_TYPES.ActivityTypesPalette) protected readonly types: TypesPaletteHandler;
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;

  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (isUnwrapable(element)) {
      return {
        icon: IvyIcons.ChangeType,
        title: 'Select Activity Type',
        location: 'Middle',
        sorting: 'Y',
        action: ShowQuickActionMenuAction.create({
          elementIds: [element.id],
          paletteItems: () => this.types.getPaletteItems(),
          actions: this.actions,
          customCssClass: 'activity-type-menu'
        }),
        letQuickActionsOpen: true,
        readonlySupport: false
      };
    }
    return;
  }

  actions = (item: PaletteItem, elementIds: string[]): Action[] => [
    ChangeActivityTypeOperation.create({ elementId: elementIds[0], typeId: item.id }),
    ShowQuickActionMenuAction.empty()
  ];
}
