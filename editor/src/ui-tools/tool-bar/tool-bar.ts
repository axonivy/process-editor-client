import {
  AbstractUIExtension,
  Action,
  EditModeListener,
  EditorContextService,
  IActionHandler,
  ICommand,
  TYPES,
  GLSPActionDispatcher,
  EnableDefaultToolsAction,
  EnableToolPaletteAction,
  SetUIExtensionVisibilityAction,
  SModelRoot,
  SelectAllAction,
  MouseTool,
  MouseListener,
  SModelElement
} from '@eclipse-glsp/client';
import { SelectionListener, SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { inject, injectable, postConstruct, multiInject } from 'inversify';

import { IVY_TYPES } from '../../types';
import {
  compareButtons,
  DefaultSelectButton,
  MarqueeToolButton,
  RedoToolButton,
  ToolBarButton,
  ToolBarButtonLocation,
  ToolBarButtonProvider,
  UndoToolButton
} from './button';
import { createElement, createIcon } from '../../utils/ui-utils';
import { ShowToolBarOptionsMenuAction } from './options/action';
import { ToolBarOptionsMenu } from './options/options-menu-ui';
import { ShowToolBarMenuAction, ToolBarMenu } from './tool-bar-menu';
import { Menu } from '../menu/menu';
import { StreamlineIcons } from '../../StreamlineIcons';

const CLICKED_CSS_CLASS = 'clicked';

@injectable()
export class ToolBar extends AbstractUIExtension implements IActionHandler, EditModeListener, SelectionListener {
  static readonly ID = 'ivy-tool-bar';

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;
  @inject(TYPES.SelectionService) protected selectionService: SelectionService;
  @inject(TYPES.MouseTool) protected mouseTool: MouseTool;
  @multiInject(IVY_TYPES.ToolBarButtonProvider) protected toolBarButtonProvider: ToolBarButtonProvider[];

  protected lastActivebutton?: HTMLElement;
  protected defaultToolsButton?: HTMLElement;
  protected toggleCustomIconsButton: HTMLElement;
  protected verticalAlignButton: HTMLElement;
  protected lastMenuAction?: Action;
  protected toolBarMenu?: Menu;

  id(): string {
    return ToolBar.ID;
  }
  containerClass(): string {
    return ToolBar.ID;
  }

  @postConstruct()
  postConstruct(): void {
    this.editorContext.register(this);
    const mouseListener = new ToolBarFocusMouseListener(this);
    this.mouseTool.register(mouseListener);
  }

  protected initializeContents(containerElement: HTMLElement): void {
    this.createHeader();
    this.lastActivebutton = this.defaultToolsButton;
    containerElement.onwheel = ev => (ev.ctrlKey ? ev.preventDefault() : true);
  }

  protected onBeforeShow(_containerElement: HTMLElement, _root: Readonly<SModelRoot>): void {
    this.selectionService.register(this);
  }

  protected createHeader(): void {
    const headerCompartment = createElement('div', ['tool-bar-header']);
    headerCompartment.appendChild(this.createLeftButtons());
    headerCompartment.appendChild(this.createMiddleButtons());
    headerCompartment.appendChild(this.createRightButtons());
    this.containerElement.appendChild(headerCompartment);
    this.changeActiveButton();
  }

  private createLeftButtons(): HTMLElement {
    const leftButtons = createElement('div', ['left-buttons']);

    this.defaultToolsButton = this.createToolButton(new DefaultSelectButton());
    leftButtons.appendChild(this.defaultToolsButton);
    leftButtons.appendChild(this.createToolButton(new MarqueeToolButton()));

    if (!this.editorContext.isReadonly) {
      const editPart = createElement('div', ['edit-buttons']);
      editPart.appendChild(this.createToolButton(new UndoToolButton()));
      editPart.appendChild(this.createToolButton(new RedoToolButton()));
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
      .filter(button => button.location === location)
      .filter(button => !this.editorContext.isReadonly || button.readonly)
      .sort(compareButtons)
      .forEach(button => parent.appendChild(this.createToolButton(button)));
  }

  private createToolButton(toolBarButton: ToolBarButton): HTMLElement {
    const button = createElement('span', ['tool-bar-button']);
    button.appendChild(createIcon(['si', `si-${toolBarButton.icon}`]));
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
        button.appendChild(createIcon(['si', 'si-rotate-90', `si-${StreamlineIcons.Chevron}`]));
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
    if (_oldValue) {
      this.actionDispatcher.dispatch(SetUIExtensionVisibilityAction.create({ extensionId: ToolBar.ID, visible: true }));
    }
  }

  selectionChanged(root: Readonly<SModelRoot>, selectedElements: string[]): void {
    if (this.editorContext.isReadonly) {
      return;
    }
  }

  disable(): void {
    this.editorContext.deregister(this);
  }
}

class ToolBarFocusMouseListener extends MouseListener {
  constructor(private readonly toolBar: ToolBar) {
    super();
  }

  mouseDown(target: SModelElement, event: MouseEvent): Action[] {
    this.toolBar.changeActiveButton();
    this.toolBar.setLastMenuAction();
    return [];
  }
}
