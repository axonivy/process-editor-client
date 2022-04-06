import {
  EditModeListener,
  EditorContextService,
  GLSP_TYPES,
  GLSPActionDispatcher,
  IFeedbackActionDispatcher,
  isSetContextActionsAction,
  PaletteItem,
  RequestContextActions,
  EnableToolPaletteAction,
  isNotUndefined
} from '@eclipse-glsp/client';
import { SelectionListener, SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { inject, injectable, postConstruct, multiInject } from 'inversify';
import {
  AbstractUIExtension,
  Action,
  EnableDefaultToolsAction,
  EnableToolsAction,
  IActionHandler,
  ICommand,
  isConnectable,
  isDeletable,
  IToolManager,
  SChildElement,
  SEdge,
  SetUIExtensionVisibilityAction,
  SModelRoot,
  TYPES
} from 'sprotty';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { QuickActionUI } from '../quick-action/quick-action-ui';

import { CustomIconToggleAction } from '../diagram/icon/custom-icon-toggle-action-handler';
import { IvyMarqueeMouseTool } from './marquee-mouse-tool';
import { ChangeActivityTypeOperation, ColorizeOperation } from './operation';
import { ToolBarFeedbackAction } from './tool-bar-feedback';
import { compare, createIcon } from './tool-bar-helper';
import { ItemPickerMenu } from './item-picker-menu';
import { isUnwrapable, isWrapable } from '../wrap/model';
import { IVY_TYPES } from '../types';
import { AutoAlignButton, DeleteButton, JumpOutButton, ToolBarButton, ToolBarButtonProvider, WrapToSubButton } from './button';

const CLICKED_CSS_CLASS = 'clicked';

@injectable()
export class ToolBar extends AbstractUIExtension implements IActionHandler, EditModeListener, SelectionListener {
  static readonly ID = 'ivy-tool-palette';

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;
  @inject(GLSP_TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;
  @inject(TYPES.IToolManager) protected readonly toolManager: IToolManager;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;
  @inject(GLSP_TYPES.SelectionService) protected selectionService: SelectionService;
  @multiInject(IVY_TYPES.ToolBarButtonProvider) protected toolBarButtonProvider: ToolBarButtonProvider[];

  protected elementPickerMenu?: ItemPickerMenu;
  protected colorPickerMenu?: ItemPickerMenu;
  protected activityTypePickerMenu?: ItemPickerMenu;
  protected lastActivebutton?: HTMLElement;
  protected defaultToolsButton: HTMLElement;
  protected toggleCustomIconsButton: HTMLElement;
  protected deleteToolButton: HTMLElement;
  protected jumpOutToolButton: HTMLElement;
  protected wrapToSubToolButton: HTMLElement;
  protected autoAlignButton: HTMLElement;
  protected colorMenuButton: HTMLElement;
  protected verticalAlignButton: HTMLElement;
  protected activityTypeMenuButton: HTMLElement;
  modelRootId: string;

  id(): string {
    return ToolBar.ID;
  }
  containerClass(): string {
    return ToolBar.ID;
  }

  @postConstruct()
  postConstruct(): void {
    this.editorContext.register(this);
  }

  protected initializeContents(_containerElement: HTMLElement): void {
    this.createHeader();
    this.lastActivebutton = this.defaultToolsButton;
  }

  protected onBeforeShow(_containerElement: HTMLElement, root: Readonly<SModelRoot>): void {
    this.modelRootId = root.id;
    this.containerElement.style.maxHeight = '50px';
    this.feedbackDispatcher.registerFeedback(this, [new ToolBarFeedbackAction()]);
    this.selectionService.register(this);
  }

  protected createHeader(): void {
    const headerCompartment = document.createElement('div');
    headerCompartment.classList.add('palette-header');
    headerCompartment.appendChild(this.createHeaderTools());
    headerCompartment.appendChild(this.createDynamicTools());
    this.containerElement.appendChild(headerCompartment);
  }

  private createHeaderTools(): HTMLElement {
    const headerTools = document.createElement('div');
    headerTools.classList.add('header-tools');

    this.defaultToolsButton = this.createDefaultToolButton();
    headerTools.appendChild(this.defaultToolsButton);

    const marqueeToolButton = this.createMarqueeToolButton();
    headerTools.appendChild(marqueeToolButton);

    const toolBarButtons = this.toolBarButtonProvider
      .map(provider => provider.button(() => [...this.selectionService.getSelectedElementIDs()]))
      .filter(button => !button?.id)
      .filter(isNotUndefined);

    this.createToolBarButtons(headerTools, toolBarButtons);

    this.toggleCustomIconsButton = this.createDynamicToolButton(
      'fa-solid fa-image',
      'Toggle custom icons',
      () => new CustomIconToggleAction(!this.toggleCustomIconsButton.classList.contains('active')),
      true
    );
    headerTools.appendChild(this.toggleCustomIconsButton);

    return headerTools;
  }

  private createToolBarButtons(containerElement: HTMLElement, toolBarButtons: ToolBarButton[]): void {
    toolBarButtons
      .sort((a, b) => a.sorting.localeCompare(b.sorting))
      .forEach(button => {
        const htmlButton = createIcon([button.icon, 'fa-xs']);
        htmlButton.title = button.title;
        this.showDynamicBtn(htmlButton, button.visible);
        htmlButton.onclick = _event => this.dispatchAction([button.action()]);
        if (button.id) {
          htmlButton.id = button.id;
        }
        containerElement.appendChild(htmlButton);
      });
  }

  protected createDefaultToolButton(): HTMLElement {
    const button = createIcon(['fa-solid', 'fa-mouse-pointer', 'fa-xs', 'clicked']);
    button.id = 'btn_default_tools';
    button.title = 'Enable selection tool';
    button.onclick = this.onClickStaticToolButton(this.defaultToolsButton);
    return button;
  }

  protected createMarqueeToolButton(): HTMLElement {
    const marqueeToolButton = createIcon(['fa-regular', 'fa-object-group', 'fa-xs']);
    marqueeToolButton.title = 'Enable marquee tool';
    marqueeToolButton.onclick = this.onClickStaticToolButton(marqueeToolButton, IvyMarqueeMouseTool.ID);
    return marqueeToolButton;
  }

  private createDynamicTools(): HTMLElement {
    const dynamicTools = document.createElement('div');
    dynamicTools.classList.add('header-tools', 'dynamic-tools');

    const toolBarButtons = this.toolBarButtonProvider
      .map(provider => provider.button(() => [...this.selectionService.getSelectedElementIDs()]))
      .filter(button => button?.id)
      .filter(isNotUndefined);

    this.createToolBarButtons(dynamicTools, toolBarButtons);
    this.jumpOutToolButton = this.getButtonById(dynamicTools, JumpOutButton.ID);
    this.deleteToolButton = this.getButtonById(dynamicTools, DeleteButton.ID);
    this.wrapToSubToolButton = this.getButtonById(dynamicTools, WrapToSubButton.ID);
    this.autoAlignButton = this.getButtonById(dynamicTools, AutoAlignButton.ID);

    this.colorMenuButton = createIcon(['fa-solid', 'fa-palette', 'fa-xs']);
    this.colorMenuButton.title = 'Select color';
    this.showDynamicBtn(this.colorMenuButton, false);
    this.colorMenuButton.onclick = _event => this.menuButtonEvent(this.colorMenuButton, this.colorPickerMenu);
    dynamicTools.appendChild(this.colorMenuButton);

    this.activityTypeMenuButton = createIcon(['fa-solid', 'fa-list', 'fa-xs']);
    this.activityTypeMenuButton.title = 'Select Activity Type';
    this.showDynamicBtn(this.activityTypeMenuButton, false);
    this.activityTypeMenuButton.onclick = _event => this.menuButtonEvent(this.activityTypeMenuButton, this.activityTypePickerMenu);
    dynamicTools.appendChild(this.activityTypeMenuButton);
    return dynamicTools;
  }

  private menuButtonEvent = (menuButton: HTMLElement, pickerMenu: ItemPickerMenu | undefined): void => {
    if (this.lastActivebutton === menuButton && pickerMenu?.isMenuHidden()) {
      this.changeActiveButton(this.defaultToolsButton);
    } else {
      this.changeActiveButton(menuButton);
      pickerMenu?.showMenu();
    }
  };

  private getButtonById(containerElement: HTMLElement, id: string): HTMLElement {
    return containerElement.querySelector('#' + id) as HTMLElement;
  }

  protected createDynamicToolButton(icon: string, title: string, action: () => Action, visible: boolean): HTMLElement {
    const button = createIcon([icon, 'fa-xs']);
    button.title = title;
    this.showDynamicBtn(button, visible);
    button.onclick = _event => this.dispatchAction([action()]);
    return button;
  }

  private showDynamicBtn(btn: HTMLElement, show: boolean): void {
    btn.style.display = show ? 'inline-block' : 'none';
  }

  public showJumpOutBtn(show: boolean): void {
    this.showDynamicBtn(this.jumpOutToolButton, show);
  }

  public toggleCustomIconBtn(active: boolean): void {
    if (active) {
      this.toggleCustomIconsButton.classList.add('active');
    } else {
      this.toggleCustomIconsButton.classList.remove('active');
    }
  }

  protected onClickStaticToolButton(button: HTMLElement, toolId?: string) {
    return (_ev: MouseEvent) => {
      const action = toolId ? new EnableToolsAction([toolId]) : new EnableDefaultToolsAction();
      this.dispatchAction([action]);
      this.changeActiveButton(button);
      button.focus();
    };
  }

  private dispatchAction(actions: Action[]): void {
    const selectedElements = this.selectionService.getSelectedElements();
    if (selectedElements.length === 1 && selectedElements[0] instanceof SEdge) {
      this.actionDispatcher.dispatchAll(actions.concat(new SetUIExtensionVisibilityAction(QuickActionUI.ID, false)));
    } else {
      this.actionDispatcher.dispatchAll(
        actions.concat(new SetUIExtensionVisibilityAction(QuickActionUI.ID, true, [...this.selectionService.getSelectedElementIDs()]))
      );
    }
  }

  onClickElementPickerToolButton = (button: HTMLElement, actions: Action[]): void => {
    if (!this.editorContext.isReadonly) {
      this.dispatchAction(actions);
      this.changeActiveButton(button);
      button.focus();
    }
  };

  clearToolOnEscape = (event: KeyboardEvent): void => {
    if (matchesKeystroke(event, 'Escape')) {
      this.actionDispatcher.dispatch(new EnableDefaultToolsAction());
    }
  };

  changeActiveButton(button?: HTMLElement): void {
    if (this.lastActivebutton) {
      this.lastActivebutton.classList.remove(CLICKED_CSS_CLASS);
    }
    if (button) {
      button.classList.add(CLICKED_CSS_CLASS);
      this.lastActivebutton = button;
    } else {
      this.defaultToolsButton.classList.add(CLICKED_CSS_CLASS);
      this.lastActivebutton = this.defaultToolsButton;
    }
    this.elementPickerMenu?.hideMenu();
    this.colorPickerMenu?.hideMenu();
    this.activityTypePickerMenu?.hideMenu();
  }

  handle(action: Action): ICommand | Action | void {
    if (action.kind === EnableToolPaletteAction.KIND) {
      const requestAction = new RequestContextActions(ToolBar.ID, {
        selectedElementIds: []
      });
      this.actionDispatcher.request(requestAction).then(response => {
        if (isSetContextActionsAction(response)) {
          const paletteItems = response.actions.map(e => e as PaletteItem);
          const actions = (item: PaletteItem): Action[] => item.actions;
          this.elementPickerMenu = new ItemPickerMenu(paletteItems, actions, this.onClickElementPickerToolButton, this.clearToolOnEscape);
          this.createElementPickerMenu();
        }
      });
      this.actionDispatcher.request(new RequestContextActions('ivy-tool-color-palette', { selectedElementIds: [] })).then(response => {
        if (isSetContextActionsAction(response)) {
          const paletteItems = response.actions.map(e => e as PaletteItem);
          const actions = (item: PaletteItem): Action[] => [
            new ColorizeOperation([...this.selectionService.getSelectedElementIDs()], item.icon!, item.label)
          ];
          this.colorPickerMenu = new ItemPickerMenu(paletteItems, actions, this.onClickElementPickerToolButton, this.clearToolOnEscape);
          this.colorPickerMenu.createMenuBody(this.containerElement, 'color-palette-body');
        }
      });
      this.actionDispatcher
        .request(new RequestContextActions('ivy-tool-activity-type-palette', { selectedElementIds: [] }))
        .then(response => {
          if (isSetContextActionsAction(response)) {
            const paletteItems = response.actions.map(e => e as PaletteItem);
            const actions = (item: PaletteItem): Action[] => [
              new ChangeActivityTypeOperation([...this.selectionService.getSelectedElementIDs()][0], item.id)
            ];
            this.activityTypePickerMenu = new ItemPickerMenu(
              paletteItems,
              actions,
              this.onClickElementPickerToolButton,
              this.clearToolOnEscape
            );
            this.activityTypePickerMenu.createMenuBody(this.containerElement, 'activity-type-palette-body');
          }
        });
      this.actionDispatcher.dispatch(new SetUIExtensionVisibilityAction(ToolBar.ID, true));
    } else if (action instanceof EnableDefaultToolsAction) {
      this.changeActiveButton();
      this.restoreFocus();
    }
  }

  editModeChanged(_oldValue: string, _newValue: string): void {
    this.actionDispatcher.dispatch(new SetUIExtensionVisibilityAction(ToolBar.ID, true));
  }

  selectionChanged(root: Readonly<SModelRoot>, selectedElements: string[]): void {
    if (this.editorContext.isReadonly) {
      return;
    }
    const elements: SChildElement[] = [];
    selectedElements.forEach(id => {
      const element = root.index.getById(id);
      if (element instanceof SChildElement) {
        elements.push(element);
      }
    });
    const showActivityTypeMenu = elements.length === 1 && isUnwrapable(elements[0]);
    this.showDynamicBtn(this.deleteToolButton, elements.length > 0 && isDeletable(elements[0]));
    this.showDynamicBtn(this.wrapToSubToolButton, elements.length > 0 && isWrapable(elements[0]));
    this.showDynamicBtn(this.autoAlignButton, elements.length > 1 && isConnectable(elements[0]));
    this.showDynamicBtn(this.colorMenuButton, elements.length > 0 && isDeletable(elements[0]));
    this.showDynamicBtn(this.activityTypeMenuButton, showActivityTypeMenu);
    if (elements.length === 0) {
      this.colorPickerMenu?.hideMenu();
    }
    if (!showActivityTypeMenu) {
      this.activityTypePickerMenu?.hideMenu();
    }
  }

  private createElementPickerMenu(): void {
    if (this.editorContext.isReadonly) {
      return;
    }
    this.elementPickerMenu?.createMenuBody(this.containerElement, 'element-palette-body');
    const headerCompartment = this.containerElement.getElementsByClassName('palette-header')[0];
    const elementPickers = document.createElement('div');
    elementPickers.classList.add('element-pickers');

    this.elementPickerMenu
      ?.getPaletteItems()
      .sort(compare)
      .forEach(item => {
        if (item.icon && item.children) {
          if (item.children.length > 1) {
            elementPickers.appendChild(this.createElementPickerBtn(item.id, item.icon, item.label));
          } else {
            elementPickers.appendChild(this.createElementActionBtn(item.id, item.icon, item.children[0]));
          }
        }
      });
    headerCompartment.appendChild(elementPickers);
  }

  private createElementActionBtn(itemId: string, icon: string, child: PaletteItem): HTMLElement {
    const button = this.createElementPickerBtn(itemId, icon, child.label);
    button.onclick = ev => this.onClickElementPickerToolButton(button, child.actions);
    button.onkeydown = ev => this.clearToolOnEscape(ev);
    return button;
  }

  private createElementPickerBtn(itemId: string, icon: string, label: string): HTMLElement {
    const button = document.createElement('span');
    button.appendChild(createIcon([icon, 'fa-xs']));
    button.id = 'btn_ele_picker_' + itemId;
    button.title = label;
    button.onclick = _event => {
      if (this.lastActivebutton === button && !this.elementPickerMenu?.isMenuHidden()) {
        this.changeActiveButton(this.defaultToolsButton);
      } else {
        this.changeActiveButton(button);
        this.elementPickerMenu?.showGroup(itemId);
      }
    };
    return button;
  }
}
