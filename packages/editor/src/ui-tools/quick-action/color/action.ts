import { Action, GLSPActionDispatcher, PaletteItem, GModelElement, TYPES } from '@eclipse-glsp/client';
import { QuickAction, QuickActionProvider } from '../quick-action';
import { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { injectable, inject } from 'inversify';
import { IVY_TYPES } from '../../../types';
import { ColorPaletteHandler } from './action-handler';
import { IvyIcons } from '@axonivy/ui-icons';
import { ChangeColorOperation } from '@axonivy/process-editor-protocol';

@injectable()
export class SelectColorQuickActionProvider implements QuickActionProvider {
  @inject(IVY_TYPES.ColorPalette) protected readonly colors: ColorPaletteHandler;
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;

  singleQuickAction(element: GModelElement): QuickAction | undefined {
    return this.quickAction([element.id], () => this.colors.getPaletteItems());
  }

  multiQuickAction(elements: GModelElement[]): QuickAction | undefined {
    return this.quickAction(
      elements.map(element => element.id),
      () => this.colors.getPaletteItems()
    );
  }

  quickAction(elementIds: string[], paletteItems: () => PaletteItem[]): QuickAction {
    return {
      icon: IvyIcons.ColorDrop,
      title: 'Select color',
      location: 'Middle',
      sorting: 'Z',
      action: ShowQuickActionMenuAction.create({
        elementIds: elementIds,
        paletteItems: paletteItems,
        actions: this.actions,
        customCssClass: 'colors-menu',
        isEditable: true
      }),
      letQuickActionsOpen: true,
      readonlySupport: false
    };
  }

  actions = (item: PaletteItem, elementIds: string[]): Action[] => [
    ChangeColorOperation.changeColor({
      elementIds: elementIds,
      color: item.icon!,
      colorName: item.label
    })
  ];
}
