import { Action, GIssueMarker, IActionDispatcher, PaletteItem, SIssue } from '@eclipse-glsp/client';
import { Converter } from 'showdown';
import { createElement, createIcon } from '../../utils/ui-utils';
import { ItemMenu, ShowMenuAction, SimpleMenu } from '../menu/menu';
import { EditColorUi } from './color/edit-color-ui';

export interface ShowQuickActionMenuAction extends ShowMenuAction {
  kind: typeof ShowQuickActionMenuAction.KIND;
  elementIds: string[];
  actions: (item: PaletteItem, elementIds: string[]) => Action[];
  isEditable?: boolean;
}

export namespace ShowQuickActionMenuAction {
  export const KIND = 'showQuickActionMenu';

  export function create(options: {
    elementIds: string[];
    paletteItems: () => PaletteItem[];
    actions: (item: PaletteItem, elementIds: string[]) => Action[];
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

export class QuickActionMenu extends ItemMenu {
  protected menuCssClass = ['bar-menu', 'quick-action-bar-menu'];
  protected editUi?: EditColorUi;

  constructor(readonly actionDispatcher: IActionDispatcher, readonly action: ShowQuickActionMenuAction) {
    super(actionDispatcher, action);
  }

  protected appendMenuParts(body: HTMLElement): void {
    if (this.action.isEditable) {
      this.editUi = new EditColorUi(this.actionDispatcher, this.action.elementIds, body);
    }
  }

  public remove(): void {
    this.bodyDiv?.remove();
  }

  protected appendItemToGroup(group: HTMLElement): void {
    if (this.action.isEditable) {
      const button = createElement('div', [ItemMenu.ITEM_BUTTON, 'new-color-btn']);
      button.appendChild(createElement('span', ['new-color-icon', 'fa-solid', 'fa-add', 'fa-fw']));
      button.insertAdjacentText('beforeend', 'New Color');
      button.onclick = () => this.editUi?.showEditUi();
      button.onmouseenter = _ev => this.focusButton(button);
      group.appendChild(button);
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

  private createEditButton(icon: string, title: string, item: PaletteItem): HTMLElement {
    const editButton = createIcon(['fa-solid', icon, 'color-edit-button']);
    editButton.title = title;
    editButton.onclick = (ev: MouseEvent) => {
      ev.stopPropagation();
      this.editUi?.showEditUi(item);
    };
    return editButton;
  }
}

export interface ShowInfoQuickActionMenuAction extends Action {
  kind: typeof ShowInfoQuickActionMenuAction.KIND;
  elementId: string;
  markers: GIssueMarker[];
  title?: string;
  text?: string;
}

export namespace ShowInfoQuickActionMenuAction {
  export const KIND = 'showSimpleQuickActionMenu';

  export function create(options: {
    elementId: string;
    markers: GIssueMarker[];
    title?: string;
    text?: string;
  }): ShowInfoQuickActionMenuAction {
    return {
      kind: KIND,
      ...options
    };
  }

  export function is(object: any): object is ShowInfoQuickActionMenuAction {
    return Action.hasKind(object, KIND);
  }
}

export class InfoQuickActionMenu extends SimpleMenu {
  constructor(readonly action: ShowInfoQuickActionMenuAction) {
    super();
  }

  createMenuBody(bodyDiv: HTMLElement): void {
    const menu = createElement('div', ['bar-menu-text']);
    bodyDiv.appendChild(menu);

    this.action.markers.forEach(marker => menu.appendChild(this.createMarker(marker)));

    if (this.action.title) {
      const title = createElement('p', ['simple-menu-header']);
      title.textContent = this.action.title;
      menu.appendChild(title);
    }

    if (this.action.text) {
      const converter = new Converter({ simpleLineBreaks: true });
      const htmlText = converter.makeHtml(this.action.text);
      const template = document.createElement('template');
      template.innerHTML = htmlText;
      const text = createElement('div', ['simple-menu-text']);
      for (const child of template.content.childNodes) {
        text.appendChild(child);
      }
      menu.appendChild(text);
    }

    const elementId = createElement('p', ['simple-menu-text', 'simple-menu-small']);
    elementId.textContent = `PID: ${this.action.elementId}`;
    menu.appendChild(elementId);
  }

  createMarker(gMarker: GIssueMarker): HTMLElement {
    const marker = createElement('div', ['menu-marker']);
    gMarker.issues.forEach(issue => marker.appendChild(this.createIssue(issue)));
    return marker;
  }

  createIssue(sIssue: SIssue): HTMLElement {
    const issue = createElement('div', ['menu-issue']);
    const issueTitle = createElement('div', ['menu-issue-title']);
    issueTitle.appendChild(createElement('i', ['codicon', `codicon-${sIssue.severity}`]));
    const issueTitleSpan = createElement('span');
    issueTitleSpan.textContent = sIssue.severity === 'error' ? 'Error' : 'Caution';
    issueTitle.appendChild(issueTitleSpan);
    issue.appendChild(issueTitle);

    const issueMessage = createElement('p', ['menu-issue-message']);
    issueMessage.textContent = sIssue.message;
    issue.appendChild(issueMessage);
    return issue;
  }
}
