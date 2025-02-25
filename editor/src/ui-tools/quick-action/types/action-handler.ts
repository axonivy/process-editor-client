import {
  Action,
  EnableToolPaletteAction,
  GLSPActionDispatcher,
  type IActionHandler,
  type ICommand,
  PaletteItem,
  RequestContextActions,
  SetContextActions,
  TYPES
} from '@eclipse-glsp/client';
import { injectable, inject } from 'inversify';

@injectable()
export class TypesPaletteHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;

  protected paletteItems: PaletteItem[] = [];

  getPaletteItems(): PaletteItem[] {
    return this.paletteItems;
  }

  handle(action: Action): void | Action | ICommand {
    if (EnableToolPaletteAction.is(action)) {
      this.updateActivityTypePalette();
    }
  }

  private async updateActivityTypePalette(): Promise<void> {
    this.actionDispatcher
      .request(RequestContextActions.create({ contextId: 'ivy-tool-activity-type-palette', editorContext: { selectedElementIds: [] } }))
      .then(response => {
        if (SetContextActions.is(response)) {
          this.paletteItems = response.actions.map(e => e as PaletteItem);
        }
      });
  }
}
