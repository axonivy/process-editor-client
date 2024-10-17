import { Action, IActionDispatcher, MaybePromise, PaletteItem } from '@eclipse-glsp/client';
import { ItemMenu, ShowMenuAction } from '../menu/menu';

export interface ShowToolBarMenuAction extends ShowMenuAction {
  kind: typeof ShowToolBarMenuAction.KIND;
  id: string;
  actions: (item: PaletteItem) => Action[];
}

export namespace ShowToolBarMenuAction {
  export const KIND = 'showToolBarMenu';

  export function create(options: {
    id: string;
    paletteItems: () => MaybePromise<Array<PaletteItem>>;
    actions: (item: PaletteItem) => Action[];
    showSearch?: boolean;
    customCssClass?: string;
  }): ShowToolBarMenuAction {
    return {
      kind: KIND,
      ...options
    };
  }

  export function is(object: any): object is ShowToolBarMenuAction {
    return Action.hasKind(object, KIND);
  }
}

export class ToolBarMenu extends ItemMenu {
  protected menuCssClass = ['bar-menu', 'tool-bar-menu'];

  constructor(
    readonly actionDispatcher: IActionDispatcher,
    readonly action: ShowToolBarMenuAction,
    protected paletteItems: Array<PaletteItem>
  ) {
    super(actionDispatcher, action, paletteItems);
  }

  toolButtonOnClick(item: PaletteItem): Action[] {
    return this.action.actions(item);
  }
}
