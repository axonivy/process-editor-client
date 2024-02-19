import {
  Action,
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
import { UpdateColorPaletteAction, UpdatePaletteItems } from '@axonivy/process-editor-protocol';

@injectable()
export class ColorPaletteHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;

  protected paletteItems: PaletteItem[] = [];

  getPaletteItems(): PaletteItem[] {
    return this.paletteItems;
  }

  handle(action: Action): void | Action | ICommand {
    if (UpdatePaletteItems.is(action)) {
      this.updateColorPalette();
    }
    if (UpdateColorPaletteAction.is(action)) {
      this.paletteItems = action.paletteItems;
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
