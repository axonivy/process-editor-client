import {
  GLSPAbstractUIExtension,
  Action,
  DisposableCollection,
  EditorContextService,
  EnableDefaultToolsAction,
  EnableToolPaletteAction,
  GLSPActionDispatcher,
  GModelElement,
  GModelRoot,
  IActionHandler,
  ICommand,
  IEditModeListener,
  ISelectionListener,
  MouseListener,
  SelectAllAction,
  SelectionService,
  SetUIExtensionVisibilityAction,
  TYPES,
  isNotUndefined
} from '@eclipse-glsp/client';
import { inject, injectable, multiInject, postConstruct } from 'inversify';

import { IvyIcons } from '@axonivy/ui-icons';
import { IVY_TYPES } from '../../types';
import { createElement, createIcon } from '../../utils/ui-utils';
import { Menu } from '../menu/menu';
import {
  DefaultSelectButton,
  MarqueeToolButton,
  RedoToolButton,
  ToolBarButton,
  ToolBarButtonLocation,
  ToolBarButtonProvider,
  UndoToolButton,
  compareButtons
} from './button';
import { ShowToolBarOptionsMenuAction } from './options/action';
import { ToolBarOptionsMenu } from './options/options-menu-ui';
import { ShowToolBarMenuAction, ToolBarMenu } from './tool-bar-menu';
import { UpdatePaletteItems } from '@axonivy/process-editor-protocol';

const CLICKED_CSS_CLASS = 'clicked';

@injectable()
export class ToolBar extends GLSPAbstractUIExtension implements IActionHandler, IEditModeListener, ISelectionListener {
  static readonly ID = 'ivy-tool-bar';

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;
  @inject(SelectionService) protected readonly selectionService: SelectionService;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;
  @multiInject(IVY_TYPES.ToolBarButtonProvider) protected toolBarButtonProvider: ToolBarButtonProvider[];

  protected lastActivebutton?: HTMLElement;
  protected defaultToolsButton?: HTMLElement;
  protected toggleCustomIconsButton: HTMLElement;
  protected verticalAlignButton: HTMLElement;
  protected lastMenuAction?: Action;
  protected toolBarMenu?: Menu;

  protected toDisposeOnDisable = new DisposableCollection();
  protected toDisposeOnHide = new DisposableCollection();

  id(): string {
    return ToolBar.ID;
  }

  @postConstruct()
  protected init(): void {
    this.toDisposeOnDisable.push(this.editorContext.onEditModeChanged(event => this.editModeChanged(event.oldValue, event.newValue)));
  }

  containerClass(): string {
    return ToolBar.ID;
  }

  protected initializeContents(containerElement: HTMLElement): void {
    this.createHeader();
    this.lastActivebutton = this.defaultToolsButton;
    containerElement.onwheel = ev => (ev.ctrlKey ? ev.preventDefault() : true);
  }

  protected onBeforeShow(_containerElement: HTMLElement, _root: Readonly<GModelRoot>): void {
    this.toDisposeOnHide.push(this.selectionService.onSelectionChanged(event => this.selectionChanged(event.root, event.selectedElements)));
  }

  hide(): void {
    super.hide();
    this.toDisposeOnHide.dispose();
  }

  protected createHeader(): void {
    const headerCompartment = createElement('div', ['tool-bar-header']);
    headerCompartment.appendChild(this.createLeftButtons());
    headerCompartment.appendChild(this.createMiddleButtons());
    headerCompartment.appendChild(this.createRightButtons());
    this.containerElement.innerHTML = '';
    this.containerElement.appendChild(headerCompartment);
    this.changeActiveButton();
  }

  private createLeftButtons(): HTMLElement {
    const leftButtons = createElement('div', ['left-buttons']);

    this.defaultToolsButton = this.createToolButton(DefaultSelectButton);
    leftButtons.appendChild(this.defaultToolsButton);
    leftButtons.appendChild(this.createToolButton(MarqueeToolButton));

    if (!this.editorContext.isReadonly) {
      const editPart = createElement('div', ['edit-buttons']);
      editPart.appendChild(this.createToolButton(UndoToolButton));
      editPart.appendChild(this.createToolButton(RedoToolButton));
      leftButtons.appendChild(editPart);
    }
    return leftButtons;
  }

  private createMiddleButtons(): HTMLElement {
    const middleButtons = createElement('div', ['middle-buttons']);
    this.appendProvidedButtons(middleButtons, ToolBarButtonLocation.Middle);
    return middleButtons;
  }

  private createRightButtons(): HTMLElement {
    const rightButtons = createElement('div', ['right-buttons']);
    this.appendProvidedButtons(rightButtons, ToolBarButtonLocation.Right);
    return rightButtons;
  }

  private appendProvidedButtons(parent: HTMLElement, location: ToolBarButtonLocation): void {
    this.toolBarButtonProvider
      .map(provider => provider.button())
      .filter(isNotUndefined)
      .filter(button => button.location === location)
      .filter(button => !this.editorContext.isReadonly || button.readonly)
      .sort(compareButtons)
      .forEach(button => parent.appendChild(this.createToolButton(button)));
  }

  private createToolButton(toolBarButton: ToolBarButton): HTMLElement {
    const button = createElement('span', ['tool-bar-button']);
    button.appendChild(createIcon(toolBarButton.icon));
    button.title = toolBarButton.title;
    if (toolBarButton.id) {
      button.id = toolBarButton.id;
    }
    button.onclick = _ev => {
      this.dispatchAction([toolBarButton.action()]);
      if (toolBarButton.switchFocus) {
        this.changeActiveButton(button);
      }
    };
    return this.createTitleToolButton(button, toolBarButton);
  }

  public createTitleToolButton(button: HTMLElement, toolBarButton: ToolBarButton): HTMLElement {
    if (toolBarButton.showTitle) {
      const titleButton = createElement('span', ['tool-bar-title-button']);
      const title = document.createElement('label');
      title.textContent = toolBarButton.title;
      if (!toolBarButton.isNotMenu) {
        button.appendChild(createIcon(IvyIcons.Chevron));
      }
      titleButton.appendChild(title);
      titleButton.appendChild(button);
      return titleButton;
    }
    return button;
  }

  private dispatchAction(actions: Action[]): void {
    this.actionDispatcher.dispatchAll(actions.concat(SelectAllAction.create(false)));
  }

  handle(action: Action): ICommand | Action | void {
    if (EnableToolPaletteAction.is(action)) {
      return SetUIExtensionVisibilityAction.create({ extensionId: ToolBar.ID, visible: true });
    }
    if (EnableDefaultToolsAction.is(action)) {
      this.changeActiveButton();
      this.restoreFocus();
    }
    if (ShowToolBarOptionsMenuAction.is(action)) {
      this.toggleOptionsMenu(action);
    }
    if (ShowToolBarMenuAction.is(action)) {
      this.toggleToolBarMenu(action);
    }
    if (UpdatePaletteItems.is(action)) {
      if (this.containerElement) {
        this.createHeader();
      }
    }
  }

  toggleToolBarMenu(action: ShowToolBarMenuAction): void {
    const items = action.paletteItems();
    if (
      items.length !== 0 &&
      !(
        ShowToolBarMenuAction.is(this.lastMenuAction) &&
        this.lastMenuAction.paletteItems().length === items.length &&
        this.lastMenuAction.paletteItems()[0].label === items[0].label
      )
    ) {
      this.toolBarMenu = new ToolBarMenu(this.actionDispatcher, action);
      const menu = this.toolBarMenu.create(this.containerElement);
      if (this.lastActivebutton) {
        const menuRight = menu.offsetLeft + menu.offsetWidth;
        const buttonCenter = this.lastActivebutton.offsetLeft + this.lastActivebutton.offsetWidth / 2;
        menu.style.setProperty('--menu-arrow-pos', `${menuRight - buttonCenter - 6}px`);
      }
      this.setLastMenuAction(action);
    } else {
      this.changeActiveButton();
      this.setLastMenuAction(undefined);
    }
  }

  toggleOptionsMenu(action: ShowToolBarOptionsMenuAction): void {
    if (!ShowToolBarOptionsMenuAction.is(this.lastMenuAction)) {
      this.toolBarMenu = new ToolBarOptionsMenu(this.actionDispatcher, action);
      this.toolBarMenu.create(this.containerElement);
      this.setLastMenuAction(action);
    } else {
      this.changeActiveButton();
      this.setLastMenuAction(undefined);
    }
  }

  setLastMenuAction(menuAction?: Action): void {
    this.lastMenuAction = menuAction;
  }

  changeActiveButton(button?: HTMLElement): void {
    this.lastActivebutton?.classList.remove(CLICKED_CSS_CLASS);
    let activeButton = this.defaultToolsButton;
    if (button) {
      activeButton = button;
    }
    activeButton?.classList.add(CLICKED_CSS_CLASS);
    this.lastActivebutton = activeButton;
    this.hideMenus();
  }

  hideMenus(): void {
    this.toolBarMenu?.remove();
    this.toolBarMenu = undefined;
  }

  editModeChanged(_oldValue: string, _newValue: string): void {
    if (this.containerElement) {
      this.createHeader();
    }
  }

  selectionChanged(root: Readonly<GModelRoot>, selectedElements: string[]): void {
    // placeholder
  }

  disable(): void {
    this.toDisposeOnDisable.dispose();
  }
}

@injectable()
export class ToolBarFocusMouseListener extends MouseListener {
  constructor(@inject(ToolBar) private readonly toolBar: ToolBar) {
    super();
  }

  mouseDown(target: GModelElement, event: MouseEvent): Action[] {
    this.toolBar.changeActiveButton();
    this.toolBar.setLastMenuAction();
    return [];
  }
}
