import { Action, IActionDispatcher, PaletteItem } from '@eclipse-glsp/client';
import { createIcon } from '../../utils/ui-utils';
import { EditColorUi } from './color/edit-color-ui';
import { MenuUi, ShowMenuAction } from '../menu/menu';

export interface ShowQuickActionMenuAction extends ShowMenuAction {
  kind: typeof ShowQuickActionMenuAction.KIND;
  elementIds: string[];
  actions: (item: PaletteItem, elementIds: string[]) => Action[];
  hideItemsContaining?: string[];
  isEditable?: boolean;
}

export namespace ShowQuickActionMenuAction {
  export const KIND = 'showQuickActionMenu';

  export function create(options: {
    elementIds: string[];
    paletteItems: () => PaletteItem[];
    actions: (item: PaletteItem, elementIds: string[]) => Action[];
    hideItemsContaining?: string[];
    showSearch?: boolean;
    customCssClass?: string;
    isEditable?: boolean;
  }): ShowQuickActionMenuAction {
    return {
      kind: KIND,
      ...options
    };
  }

  export function empty(): ShowQuickActionMenuAction {
    return create({
      elementIds: [],
      paletteItems: () => [],
      actions: (item: PaletteItem, elementIds: string[]) => []
    });
  }

  export function is(object: any): object is ShowQuickActionMenuAction {
    return Action.hasKind(object, KIND);
  }
}

export class QuickActionMenu extends MenuUi {
  protected menuCssClass = ['bar-menu', 'quick-action-bar-menu'];
  protected editDialog?: EditColorUi;

  constructor(readonly actionDispatcher: IActionDispatcher, readonly action: ShowQuickActionMenuAction) {
    super(actionDispatcher, action);
  }

  protected appendMenuParts(body: HTMLElement): void {
    if (this.action.isEditable) {
      this.editDialog = new EditColorUi(this.actionDispatcher, this.action.elementIds, body);
    }
  }

  public remove(): void {
    this.bodyDiv?.remove();
  }

  protected filterItemByLabel(label: string): boolean {
    if (this.action.hideItemsContaining === undefined || this.action.hideItemsContaining.length === 0) {
      return true;
    }
    return this.action.hideItemsContaining.find(hideItem => label.includes(hideItem)) === undefined;
  }

  protected appendToGroupHeader(groupHeader: HTMLElement): void {
    if (this.action.isEditable) {
      groupHeader.appendChild(this.createEditButton('fa-add', 'Add Color'));
    }
  }

  toolButtonOnClick(item: PaletteItem): Action[] {
    return this.action.actions(item, this.action.elementIds);
  }

  protected appendToToolButton(button: HTMLElement, item: PaletteItem): void {
    if (this.action.isEditable && item.label !== 'default') {
      button.appendChild(this.createEditButton('fa-pencil', 'Edit Color', item));
    }
  }

  private createEditButton(icon: string, title: string, item?: PaletteItem): HTMLElement {
    const editButton = createIcon(['fa-solid', icon, 'color-edit-button']);
    editButton.title = title;
    editButton.onclick = (ev: MouseEvent) => {
      ev.stopPropagation();
      this.editDialog?.showDialog(item);
    };
    return editButton;
  }
}
