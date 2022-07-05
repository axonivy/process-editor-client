import { Action, PaletteItem } from '@eclipse-glsp/client';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { IconStyle, resolvePaletteIcon } from '../diagram/icon/icons';
import { EditDialog } from './edit-dialog';
import { changeCSSClass, compare, createIcon } from './tool-bar-helper';

export class ItemPickerMenu {
  static ACTIVE_ELEMENT = 'focus';
  static COLLAPSED_GROUP = 'collapsed';
  static TOOL_GROUP = 'tool-group';
  static TOOL_BUTTON = 'tool-button';

  protected paletteItems: PaletteItem[];
  protected paletteItemsCopy: PaletteItem[] = [];
  protected bodyDiv?: HTMLElement;
  protected itemsDiv?: HTMLElement;
  protected editDialog?: EditDialog;
  protected searchField: HTMLInputElement;

  constructor(
    paletteItems: PaletteItem[],
    readonly paletteBodyCssClass: string,
    readonly actions: (item: PaletteItem) => Action[],
    readonly onClickElementPickerToolButton: (button: HTMLElement, actions: Action[]) => void,
    readonly clearToolOnEscape: (event: KeyboardEvent) => void,
    readonly handleEditDialogClose?: (returnValue: string, formData: FormData, item?: PaletteItem) => void,
    readonly hideItemsContaining?: string[]
  ) {
    this.paletteItems = paletteItems;
  }

  public createMenuBody(containerElement: HTMLElement): void {
    const bodyDiv = document.createElement('div');
    containerElement.appendChild(bodyDiv);
    bodyDiv.classList.add(this.paletteBodyCssClass, 'palette-body', 'collapsible-palette', ItemPickerMenu.COLLAPSED_GROUP);
    bodyDiv.appendChild((this.searchField = this.createPaletteItemSearchField(containerElement.id)));
    this.bodyDiv = bodyDiv;
    this.createItemsDiv(bodyDiv);
    if (this.handleEditDialogClose) {
      this.editDialog = new EditDialog(bodyDiv);
    }
  }

  public removeMenuBody(): void {
    if (this.bodyDiv) {
      this.bodyDiv.remove();
    }
  }

  public showGroup(groupId: string): void {
    this.showMenu();
    Array.from(this.bodyDiv!.getElementsByClassName(ItemPickerMenu.TOOL_GROUP)).forEach(element => {
      if (element.id === groupId) {
        element.classList.remove(ItemPickerMenu.COLLAPSED_GROUP);
      } else {
        element.classList.add(ItemPickerMenu.COLLAPSED_GROUP);
      }
    });
  }

  public isMenuHidden(): boolean | undefined {
    return this.bodyDiv?.classList.contains(ItemPickerMenu.COLLAPSED_GROUP);
  }

  public hideMenu(): void {
    this.bodyDiv!.classList.add(ItemPickerMenu.COLLAPSED_GROUP);
  }

  public showMenu(): void {
    this.bodyDiv!.classList.remove(ItemPickerMenu.COLLAPSED_GROUP);
    setTimeout(() => this.searchField.focus(), 1);
  }

  public getPaletteItems(): PaletteItem[] {
    return this.paletteItems;
  }

  private createPaletteItemSearchField(containerElementId: string): HTMLInputElement {
    const searchField = document.createElement('input');
    searchField.classList.add('search-input');
    searchField.type = 'text';
    searchField.placeholder = ' Search...';
    searchField.onkeyup = ev => this.filterKeyUp(ev);
    searchField.onkeydown = ev => this.clearSearchInputOnEscape(ev);
    return searchField;
  }

  private filterKeyUp(event: KeyboardEvent): void {
    if (matchesKeystroke(event, 'ArrowUp')) {
      this.navigateUpOrDown(-1);
    } else if (matchesKeystroke(event, 'ArrowDown')) {
      this.navigateUpOrDown(1);
    } else if (matchesKeystroke(event, 'Enter')) {
      this.triggerFocusItem();
    } else {
      this.requestFilterUpdate(this.searchField.value);
    }
  }

  private clearSearchInputOnEscape(event: KeyboardEvent): void {
    if (matchesKeystroke(event, 'Escape')) {
      this.searchField.value = '';
      this.requestFilterUpdate('');
    }
  }

  private requestFilterUpdate(filter: string): void {
    // Initialize the copy if it's empty
    if (this.paletteItemsCopy.length === 0) {
      // Creating deep copy
      this.paletteItemsCopy = JSON.parse(JSON.stringify(this.paletteItems));
    }

    // Reset the paletteItems before searching
    this.paletteItems = JSON.parse(JSON.stringify(this.paletteItemsCopy));
    // Filter the entries
    const filteredPaletteItems: PaletteItem[] = [];
    for (const itemGroup of this.paletteItems) {
      if (itemGroup.children) {
        // Fetch the labels according to the filter
        const matchingChildren = itemGroup.children
          .filter(child => !this.shouldItemBeHidden(child.label))
          .filter(child => child.label.toLowerCase().includes(filter.toLowerCase()));
        // Add the itemgroup containing the correct entries
        if (matchingChildren.length > 0) {
          // Clear existing children
          itemGroup.children.splice(0, itemGroup.children.length);
          // Push the matching children
          matchingChildren.forEach(child => itemGroup.children!.push(child));
          filteredPaletteItems.push(itemGroup);
        }
      }
    }
    this.paletteItems = filteredPaletteItems;
    if (this.bodyDiv) {
      this.createItemsDiv(this.bodyDiv);
    }
  }

  private navigateUpOrDown(move: number): void {
    if (this.itemsDiv) {
      const allButtons = Array.from(this.itemsDiv.querySelectorAll(`.${this.paletteBodyCssClass} .${ItemPickerMenu.TOOL_BUTTON}`));
      const currentSelection = allButtons.filter(e => e.classList.contains(ItemPickerMenu.ACTIVE_ELEMENT))[0];
      if (!currentSelection) {
        allButtons[0].classList.add(ItemPickerMenu.ACTIVE_ELEMENT);
      } else {
        currentSelection.classList.remove(ItemPickerMenu.ACTIVE_ELEMENT);
        let nextIndex = allButtons.indexOf(currentSelection) + move;
        if (nextIndex < 0) {
          nextIndex = allButtons.length - 1;
        } else if (nextIndex >= allButtons.length) {
          nextIndex = 0;
        }
        allButtons[nextIndex].classList.add(ItemPickerMenu.ACTIVE_ELEMENT);
        allButtons[nextIndex].parentElement?.classList.remove(ItemPickerMenu.COLLAPSED_GROUP);
        allButtons[nextIndex].scrollIntoView(false);
      }
    }
  }

  private triggerFocusItem(): void {
    const currentItem = this.currentItem() as HTMLElement;
    currentItem?.click();
  }

  private currentItem(): Element | null | undefined {
    return this.itemsDiv?.querySelector(`.${this.paletteBodyCssClass} .${ItemPickerMenu.TOOL_BUTTON}.${ItemPickerMenu.ACTIVE_ELEMENT}`);
  }

  private createItemsDiv(bodyDiv: HTMLElement): void {
    const itemsDiv = document.createElement('div');
    let tabIndex = 0;
    this.paletteItems.sort(compare).forEach(item => {
      if (item.children) {
        const group = this.createToolGroup(item);
        item.children
          .sort(compare)
          .filter(child => !this.shouldItemBeHidden(child.label))
          .forEach(child => group.appendChild(this.createToolButton(child, tabIndex++)));
        itemsDiv.appendChild(group);
      } else {
        itemsDiv.appendChild(this.createToolButton(item, tabIndex++));
      }
    });
    if (this.paletteItems.length === 0) {
      const noResultsDiv = document.createElement('div');
      noResultsDiv.innerText = 'No results found.';
      noResultsDiv.classList.add(ItemPickerMenu.TOOL_BUTTON);
      itemsDiv.appendChild(noResultsDiv);
    }
    // Remove existing body to refresh filtered entries
    if (this.itemsDiv) {
      bodyDiv.removeChild(this.itemsDiv);
    }
    bodyDiv.appendChild(itemsDiv);
    this.itemsDiv = itemsDiv;
    this.navigateUpOrDown(1);
  }

  private shouldItemBeHidden(label: string): boolean {
    if (this.hideItemsContaining === undefined || this.hideItemsContaining.length === 0) {
      return false;
    }
    return this.hideItemsContaining.find(hideItem => label.includes(hideItem)) !== undefined;
  }

  private createToolButton(item: PaletteItem, index: number): HTMLElement {
    const button = document.createElement('div');
    button.tabIndex = index;
    button.classList.add(ItemPickerMenu.TOOL_BUTTON);
    button.appendChild(this.appendPaletteIcon(button, item));
    button.insertAdjacentText('beforeend', item.label);
    if (this.handleEditDialogClose && item.label !== 'default') {
      button.appendChild(this.createEditButton('fa-pencil', 'Edit Color', item));
    }
    button.onclick = (ev: MouseEvent) => this.onClickElementPickerToolButton(button, this.actions(item));
    button.onkeydown = ev => this.clearToolOnEscape(ev);
    button.onmouseover = _ev => {
      this.currentItem()?.classList.remove(ItemPickerMenu.ACTIVE_ELEMENT);
      button.classList.add(ItemPickerMenu.ACTIVE_ELEMENT);
    };
    return button;
  }

  private appendPaletteIcon(button: HTMLElement, item: PaletteItem): Node {
    if (item.icon) {
      const icon = resolvePaletteIcon(item.icon);
      if (icon.style === IconStyle.FA) {
        return createIcon([icon.res, 'fa-fw']);
      }
      if (icon.style === IconStyle.SVG) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 10 10');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', icon.res);
        svg.appendChild(path);
        return svg;
      }
      if (icon.style === IconStyle.UNKNOWN) {
        const span = document.createElement('span');
        span.style.backgroundColor = item.icon;
        span.classList.add('color-icon');
        return span;
      }
    }
    const emptyIcon = document.createElement('span');
    emptyIcon.classList.add('empty-icon');
    return emptyIcon;
  }

  private createToolGroup(item: PaletteItem): HTMLElement {
    const group = document.createElement('div');
    group.classList.add(ItemPickerMenu.TOOL_GROUP);
    group.id = item.id;
    const header = document.createElement('div');
    header.classList.add('group-header');
    if (item.icon) {
      header.appendChild(createIcon([resolvePaletteIcon(item.icon).res]));
    }
    header.insertAdjacentText('beforeend', item.label);
    if (this.handleEditDialogClose) {
      header.appendChild(this.createEditButton('fa-add', 'Add Color'));
    }
    header.onclick = _ev => {
      changeCSSClass(group, ItemPickerMenu.COLLAPSED_GROUP);
      window!.getSelection()!.removeAllRanges();
    };
    header.onmouseover = _ev => this.currentItem()?.classList.remove(ItemPickerMenu.ACTIVE_ELEMENT);

    group.appendChild(header);
    return group;
  }

  private createEditButton(icon: string, title: string, item?: PaletteItem): HTMLElement {
    const editButton = createIcon(['fa-solid', icon, 'edit-item-button']);
    editButton.title = title;
    editButton.onclick = (ev: MouseEvent) => {
      ev.stopPropagation();
      this.editDialog?.showDialog(this.handleEditDialogClose!, item);
    };
    return editButton;
  }
}
