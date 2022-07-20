import {
  Action,
  EnableToolPaletteAction,
  GLSPActionDispatcher,
  IActionHandler,
  ICommand,
  PaletteItem,
  RequestContextActions,
  SetContextActions,
  TYPES
} from '@eclipse-glsp/client';
import { injectable, inject } from 'inversify';
import { ShowQuickActionMenuAction } from '../quick-action-menu-ui';

export interface UpdateColorPaletteAction extends Action {
  kind: typeof UpdateColorPaletteAction.KIND;
}

export namespace UpdateColorPaletteAction {
  export const KIND = 'updateColorPalette';

  export function is(object: any): object is UpdateColorPaletteAction {
    return Action.hasKind(object, KIND);
  }

  export function create(): UpdateColorPaletteAction {
    return {
      kind: KIND
    };
  }
}

@injectable()
export class ColorPaletteHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;

  protected paletteItems: PaletteItem[] = [];

  getPaletteItems(): PaletteItem[] {
    return this.paletteItems;
  }

  handle(action: Action): void | Action | ICommand {
    if (EnableToolPaletteAction.is(action) || UpdateColorPaletteAction.is(action)) {
      this.updateColorPalette();
      this.actionDispatcher.dispatch(ShowQuickActionMenuAction.empty());
    }
  }

  private async updateColorPalette(): Promise<void> {
    this.actionDispatcher
      .request(RequestContextActions.create({ contextId: 'ivy-tool-color-palette', editorContext: { selectedElementIds: [] } }))
      .then(response => {
        if (SetContextActions.is(response)) {
          this.paletteItems = response.actions.map(e => e as PaletteItem);
        }
      });
  }
}
