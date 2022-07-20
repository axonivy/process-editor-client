import { Action, GLSPActionDispatcher, Operation, PaletteItem, SModelElement, TYPES } from '@eclipse-glsp/client';
import { QuickAction, QuickActionLocation, QuickActionProvider } from '../quick-action';
import { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { injectable, inject } from 'inversify';
import { IVY_TYPES } from '../../../types';
import { ColorPaletteHandler } from './action-handler';
import { EditColorUi } from './edit-color-ui';

export interface ColorizeOperation extends Operation {
  kind: typeof ColorizeOperation.KIND;
  elementIds: string[];
  color: string;
  colorName: string;
}

export namespace ColorizeOperation {
  export const KIND = 'colorize';

  export function create(options: { elementIds: string[]; color: string; colorName: string }): ColorizeOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}

export interface ChangeColorOperation extends Operation {
  kind: typeof ChangeColorOperation.KIND;
  color: string;
  colorName: string;
  oldColor: string;
}

export namespace ChangeColorOperation {
  export const KIND = 'changeColor';

  export function create(options: { color: string; colorName: string; oldColor: string }): ChangeColorOperation {
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
    return new SelectColorQuickAction([element.id], () => this.colors.getPaletteItems(), this.actions, this.handleEditDialogClose);
  }

  multiQuickAction(elements: SModelElement[]): QuickAction | undefined {
    return new SelectColorQuickAction(
      elements.map(element => element.id),
      () => this.colors.getPaletteItems(),
      this.actions,
      this.handleEditDialogClose
    );
  }

  actions = (item: PaletteItem, elementIds: string[]): Action[] => [
    ColorizeOperation.create({
      elementIds: elementIds,
      color: item.icon!,
      colorName: item.label
    })
  ];

  handleEditDialogClose = (returnValue: string, formData: FormData, item?: PaletteItem): void => {
    if (returnValue === EditColorUi.DIALOG_CLOSE) {
      return;
    }
    const oldColor = item?.label ?? '';
    let colorName = '';
    let color = '';
    if (returnValue === EditColorUi.DIALOG_CONFIRM) {
      const newColor = Object.fromEntries(formData.entries());
      colorName = newColor.Name.toString();
      color = newColor.Color.toString();
    }
    this.actionDispatcher.dispatch(ChangeColorOperation.create({ color: color, colorName: colorName, oldColor: oldColor }));
  };
}

class SelectColorQuickAction implements QuickAction {
  constructor(
    public readonly elementIds: string[],
    public readonly paletteItems: () => PaletteItem[],
    public readonly actions: (item: PaletteItem, elementIds: string[]) => Action[],
    public readonly handleEditDialogClose?: (returnValue: string, formData: FormData, item?: PaletteItem) => void,
    public readonly icon = 'fa-solid fa-palette',
    public readonly title = 'Select color',
    public readonly location = QuickActionLocation.Middle,
    public readonly sorting = 'Z',
    public readonly action = ShowQuickActionMenuAction.create({
      elementIds: elementIds,
      paletteItems: paletteItems,
      actions: actions,
      handleEditDialogClose: handleEditDialogClose,
      customCssClass: 'colors-menu'
    }),
    public readonly letQuickActionsOpen = true,
    public readonly readonlySupport = false
  ) {}
}
