import { Action, GLSPActionDispatcher, Operation, PaletteItem, SModelElement, TYPES } from '@eclipse-glsp/client';
import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../quick-action';
import { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { injectable, inject } from 'inversify';
import { IVY_TYPES } from '../../../types';
import { TypesPaletteHandler } from './action-handler';
import { isUnwrapable } from '../../../wrap/model';
import { StreamlineIcons } from '../../../StreamlineIcons';

export interface ChangeActivityTypeOperation extends Operation {
  kind: typeof ChangeActivityTypeOperation.KIND;
  elementId: string;
  typeId: string;
}

export namespace ChangeActivityTypeOperation {
  export const KIND = 'changeActivityType';

  export function create(options: { elementId: string; typeId: string }): ChangeActivityTypeOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}

@injectable()
export class SelectActivityTypeQuickActionProvider extends SingleQuickActionProvider {
  @inject(IVY_TYPES.ActivityTypesPalette) protected readonly types: TypesPaletteHandler;
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;

  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isUnwrapable(element)) {
      return new ChangeActivityTypeQuickAction([element.id], () => this.types.getPaletteItems(), this.actions);
    }
    return;
  }

  actions = (item: PaletteItem, elementIds: string[]): Action[] => [
    ChangeActivityTypeOperation.create({ elementId: elementIds[0], typeId: item.id })
  ];
}

class ChangeActivityTypeQuickAction implements QuickAction {
  constructor(
    public readonly elementIds: string[],
    public readonly paletteItems: () => PaletteItem[],
    public readonly actions: (item: PaletteItem, elementIds: string[]) => Action[],
    public readonly icon = StreamlineIcons.UserTask,
    public readonly title = 'Select Activity Type',
    public readonly location = QuickActionLocation.Middle,
    public readonly sorting = 'Z',
    public readonly action = ShowQuickActionMenuAction.create({
      elementIds: elementIds,
      paletteItems: paletteItems,
      actions: actions,
      customCssClass: 'activity-type-menu'
    }),
    public readonly letQuickActionsOpen = true,
    public readonly readonlySupport = false
  ) {}
}
