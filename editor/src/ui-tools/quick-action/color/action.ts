import { Action, GLSPActionDispatcher, Operation, PaletteItem, SModelElement, TYPES } from '@eclipse-glsp/client';
import { type QuickAction, QuickActionLocation, type QuickActionProvider } from '../quick-action';
import { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { injectable, inject } from 'inversify';
import { IVY_TYPES } from '../../../types';
import { ColorPaletteHandler } from './action-handler';
import { StreamlineIcons } from '../../../StreamlineIcons';

export interface ChangeColorOperation extends Operation {
  kind: typeof ChangeColorOperation.KIND;
  elementIds: string[];
  color?: string;
  colorName?: string;
  oldColor?: string;
}

export namespace ChangeColorOperation {
  export const KIND = 'changeColor';

  export function changeColor(options: {
    elementIds: string[];
    color: string;
    colorName: string;
    oldColor?: string;
  }): ChangeColorOperation {
    return create(options);
  }

  export function deleteColor(options: { elementIds: string[]; oldColor: string }): ChangeColorOperation {
    return create(options);
  }

  export function create(options: { elementIds: string[]; color?: string; colorName?: string; oldColor?: string }): ChangeColorOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}

@injectable()
export class SelectColorQuickActionProvider implements QuickActionProvider {
  @inject(IVY_TYPES.ColorPalette) protected readonly colors: ColorPaletteHandler;
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;

  singleQuickAction(element: SModelElement): QuickAction | undefined {
    return new SelectColorQuickAction([element.id], () => this.colors.getPaletteItems(), this.actions);
  }

  multiQuickAction(elements: SModelElement[]): QuickAction | undefined {
    return new SelectColorQuickAction(
      elements.map(element => element.id),
      () => this.colors.getPaletteItems(),
      this.actions
    );
  }

  actions = (item: PaletteItem, elementIds: string[]): Action[] => [
    ChangeColorOperation.changeColor({
      elementIds: elementIds,
      color: item.icon!,
      colorName: item.label
    })
  ];
}

class SelectColorQuickAction implements QuickAction {
  constructor(
    public readonly elementIds: string[],
    public readonly paletteItems: () => PaletteItem[],
    public readonly actions: (item: PaletteItem, elementIds: string[]) => Action[],
    public readonly icon = StreamlineIcons.Color,
    public readonly title = 'Select color',
    public readonly location = QuickActionLocation.Middle,
    public readonly sorting = 'Z',
    public readonly action = ShowQuickActionMenuAction.create({
      elementIds: elementIds,
      paletteItems: paletteItems,
      actions: actions,
      customCssClass: 'colors-menu',
      isEditable: true
    }),
    public readonly letQuickActionsOpen = true,
    public readonly readonlySupport = false
  ) {}
}
