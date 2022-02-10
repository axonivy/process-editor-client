import {
  DeleteElementOperation,
  EditModeListener,
  EditorContextService,
  GLSP_TYPES,
  GLSPActionDispatcher,
  IFeedbackActionDispatcher,
  isSetContextActionsAction,
  PaletteItem,
  RequestContextActions,
  SetContextActions
} from '@eclipse-glsp/client';
import { SelectionListener, SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { inject, injectable, postConstruct } from 'inversify';
import {
  AbstractUIExtension,
  Action,
  CenterAction,
  EnableDefaultToolsAction,
  EnableToolsAction,
  FitToScreenAction,
  IActionHandler,
  ICommand,
  IToolManager,
  SetUIExtensionVisibilityAction,
  SModelRoot,
  TYPES
} from 'sprotty';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { QuickActionUI } from '../quick-action/quick-action-ui';

import { CustomIconToggleAction } from '../diagram/icon/custom-icon-toggle-action-handler';
import { IconStyle, resolveIcon } from '../diagram/icon/icons';
import { JumpAction } from '../jump/action';
import { OriginViewportAction } from '../viewport/original-viewport';
import { WrapToSubOperation } from '../wrap/actions';
import { IvyMarqueeMouseTool } from './marquee-mouse-tool';
import { AutoAlignOperation } from './operation';
import { ToolPaletteFeedbackAction } from './tool-palette-feedback';

const CLICKED_CSS_CLASS = 'clicked';
const COLLAPSED_CSS = 'collapsed';

@injectable()
export class EnableToolPaletteAction implements Action {
  static readonly KIND = 'enableToolPalette';
  readonly kind = EnableToolPaletteAction.KIND;
}

@injectable()
export class ToolPalette extends AbstractUIExtension implements IActionHandler, EditModeListener, SelectionListener {
  static readonly ID = 'ivy-tool-palette';

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;
  @inject(GLSP_TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;
  @inject(TYPES.IToolManager) protected readonly toolManager: IToolManager;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;
  @inject(GLSP_TYPES.SelectionService) protected selectionService: SelectionService;

  protected paletteItems: PaletteItem[];
  protected paletteItemsCopy: PaletteItem[] = [];
  protected bodyDiv?: HTMLElement;
  protected itemsDiv?: HTMLElement;
  protected lastActivebutton?: HTMLElement;
  protected defaultToolsButton: HTMLElement;
  protected toggleCustomIconsButton: HTMLElement;
  protected deleteToolButton: HTMLElement;
  protected jumpOutToolButton: HTMLElement;
  protected wrapToSubToolButton: HTMLElement;
  protected autoAlignButton: HTMLElement;
  protected verticalAlignButton: HTMLElement;
  protected searchField: HTMLInputElement;
  modelRootId: string;

  id(): string {
    return ToolPalette.ID;
  }
  containerClass(): string {
    return ToolPalette.ID;
  }

  @postConstruct()
  postConstruct(): void {
    this.editorContext.register(this);
  }

  initialize(): boolean {
    if (!this.paletteItems) {
      return false;
    }
    return super.initialize();
  }

  protected initializeContents(_containerElement: HTMLElement): void {
    this.createHeader();
    this.createBody();
    this.lastActivebutton = this.defaultToolsButton;
  }

  protected onBeforeShow(_containerElement: HTMLElement, root: Readonly<SModelRoot>): void {
    this.modelRootId = root.id;
    this.containerElement.style.maxHeight = '50px';
    this.feedbackDispatcher.registerFeedback(this, [new ToolPaletteFeedbackAction()]);
    this.selectionService.register(this);
  }

  protected createBody(): void {
    const bodyDiv = document.createElement('div');
    this.containerElement.appendChild(bodyDiv);
    bodyDiv.classList.add('palette-body', 'collapsible-palette', COLLAPSED_CSS);
    bodyDiv.appendChild((this.searchField = this.createPaletteItemSearchField()));
    this.bodyDiv = bodyDiv;
    this.createItemsDiv(bodyDiv);
  }

  private createItemsDiv(bodyDiv: HTMLElement): void {
    const itemsDiv = document.createElement('div');
    let tabIndex = 0;
    this.paletteItems.sort(compare).forEach(item => {
      if (item.children) {
        const group = createToolGroup(item);
        item.children.sort(compare).forEach(child => group.appendChild(this.createToolButton(child, tabIndex++)));
        itemsDiv.appendChild(group);
      } else {
        itemsDiv.appendChild(this.createToolButton(item, tabIndex++));
      }
    });
    if (this.paletteItems.length === 0) {
      const noResultsDiv = document.createElement('div');
      noResultsDiv.innerText = 'No results found.';
      noResultsDiv.classList.add('tool-button');
      itemsDiv.appendChild(noResultsDiv);
    }
    // Remove existing body to refresh filtered entries
    if (this.itemsDiv) {
      bodyDiv.removeChild(this.itemsDiv);
    }
    bodyDiv.appendChild(itemsDiv);
    this.itemsDiv = itemsDiv;
  }

  protected createHeader(): void {
    const headerCompartment = document.createElement('div');
    headerCompartment.classList.add('palette-header');
    headerCompartment.appendChild(this.createHeaderTools());
    headerCompartment.appendChild(this.createDynamicTools());
    headerCompartment.appendChild(this.createElementPickers());
    this.containerElement.appendChild(headerCompartment);
  }

  private createElementPickers(): HTMLElement {
    const elementPickers = document.createElement('div');
    if (this.editorContext.isReadonly) {
      return elementPickers;
    }
    elementPickers.classList.add('element-pickers');

    this.paletteItems.sort(compare).forEach(item => {
      if (item.icon && item.children) {
        if (item.children.length > 1) {
          elementPickers.appendChild(this.createElementPickerBtn(item.id, item.icon, item.label));
        } else {
          elementPickers.appendChild(this.createElementActionBtn(item.id, item.icon, item.children[0]));
        }
      }
    });

    return elementPickers;
  }

  private createElementActionBtn(itemId: string, icon: string, child: PaletteItem): HTMLElement {
    const button = this.createElementPickerBtn(itemId, icon, child.label);
    button.onclick = this.onClickCreateToolButton(button, child);
    button.onkeydown = ev => this.clearToolOnEscape(ev);
    return button;
  }

  private createElementPickerBtn(itemId: string, icon: string, label: string): HTMLElement {
    const button = document.createElement('span');
    button.appendChild(createIcon([icon, 'fa-xs']));
    button.id = 'btn_ele_picker_' + itemId;
    button.title = label;
    button.onclick = _event => {
      if (this.lastActivebutton === button && !this.bodyDiv?.classList.contains(COLLAPSED_CSS)) {
        this.changeActiveButton(this.defaultToolsButton);
      } else {
        this.changeActiveButton(button);
        this.showGroup(itemId);
      }
    };
    return button;
  }

  private createHeaderTools(): HTMLElement {
    const headerTools = document.createElement('div');
    headerTools.classList.add('header-tools');

    this.defaultToolsButton = this.createDefaultToolButton();
    headerTools.appendChild(this.defaultToolsButton);

    const marqueeToolButton = this.createMarqueeToolButton();
    headerTools.appendChild(marqueeToolButton);

    const originViewportButton = this.createDynamicToolButton('fa-desktop', 'Origin screen', () => new OriginViewportAction(), true);
    headerTools.appendChild(originViewportButton);

    const fitToScreenButton = this.createDynamicToolButton('fa-vector-square', 'Fit to screen', () => new FitToScreenAction([]), true);
    headerTools.appendChild(fitToScreenButton);

    const centerActionButton = this.createDynamicToolButton(
      'fa-crosshairs',
      'Center',
      () => new CenterAction([...this.selectionService.getSelectedElementIDs()]),
      true
    );
    headerTools.appendChild(centerActionButton);

    this.toggleCustomIconsButton = this.createDynamicToolButton(
      'fa-image',
      'Toggle custom icons',
      () => new CustomIconToggleAction(!this.toggleCustomIconsButton.classList.contains('active')),
      true
    );
    headerTools.appendChild(this.toggleCustomIconsButton);

    return headerTools;
  }

  protected createDefaultToolButton(): HTMLElement {
    const button = createIcon(['fas', 'fa-mouse-pointer', 'fa-xs', 'clicked']);
    button.id = 'btn_default_tools';
    button.title = 'Enable selection tool';
    button.onclick = this.onClickStaticToolButton(this.defaultToolsButton);
    return button;
  }

  protected createMarqueeToolButton(): HTMLElement {
    const marqueeToolButton = createIcon(['far', 'fa-object-group', 'fa-xs']);
    marqueeToolButton.title = 'Enable marquee tool';
    marqueeToolButton.onclick = this.onClickStaticToolButton(marqueeToolButton, IvyMarqueeMouseTool.ID);
    return marqueeToolButton;
  }

  private createDynamicTools(): HTMLElement {
    const dynamicTools = document.createElement('div');
    dynamicTools.classList.add('header-tools', 'dynamic-tools');

    this.jumpOutToolButton = this.createDynamicToolButton('fa-level-up-alt', 'Jump out', () => new JumpAction(''), false);
    dynamicTools.appendChild(this.jumpOutToolButton);

    this.deleteToolButton = this.createDynamicToolButton(
      'fa-trash',
      'Delete',
      () => new DeleteElementOperation([...this.selectionService.getSelectedElementIDs()]),
      false
    );
    dynamicTools.appendChild(this.deleteToolButton);

    this.wrapToSubToolButton = this.createDynamicToolButton(
      'fa-compress-arrows-alt',
      'Wrap to embedded process',
      () => new WrapToSubOperation([...this.selectionService.getSelectedElementIDs()]),
      false
    );
    dynamicTools.appendChild(this.wrapToSubToolButton);

    this.autoAlignButton = this.createDynamicToolButton(
      'fa-arrows-alt',
      'Auto align',
      () => new AutoAlignOperation([...this.selectionService.getSelectedElementIDs()]),
      false
    );
    dynamicTools.appendChild(this.autoAlignButton);

    return dynamicTools;
  }

  protected createDynamicToolButton(icon: string, title: string, action: () => Action, visible: boolean): HTMLElement {
    const button = createIcon(['fas', icon, 'fa-xs']);
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

  protected createPaletteItemSearchField(): HTMLInputElement {
    const searchField = document.createElement('input');
    searchField.classList.add('search-input');
    searchField.id = this.containerElement.id + '_search_field';
    searchField.type = 'text';
    searchField.placeholder = ' Search...';
    searchField.onkeyup = () => this.requestFilterUpdate(this.searchField.value);
    searchField.onkeydown = ev => this.clearOnEscape(ev);
    return searchField;
  }

  protected createToolButton(item: PaletteItem, index: number): HTMLElement {
    const button = document.createElement('div');
    button.tabIndex = index;
    button.classList.add('tool-button');
    button.appendChild(this.appendPaletteIcon(button, item));
    button.insertAdjacentText('beforeend', item.label);
    button.onclick = this.onClickCreateToolButton(button, item);
    button.onkeydown = ev => this.clearToolOnEscape(ev);
    return button;
  }

  private appendPaletteIcon(button: HTMLElement, item: PaletteItem): Node {
    if (item.icon) {
      const icon = resolveIcon(item.icon);
      if (icon.style === IconStyle.FA) {
        return createIcon(['fa', 'fa-fw', icon.res]);
      }
      if (icon.style === IconStyle.SVG) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 10 10');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', icon.res);
        svg.appendChild(path);
        return svg;
      }
    }
    return document.createElement('span');
  }

  protected onClickCreateToolButton(button: HTMLElement, item: PaletteItem) {
    return (_ev: MouseEvent) => {
      if (!this.editorContext.isReadonly) {
        this.dispatchAction(item.actions);
        this.changeActiveButton(button);
        button.focus();
      }
    };
  }

  protected onClickStaticToolButton(button: HTMLElement, toolId?: string) {
    return (_ev: MouseEvent) => {
      const action = toolId ? new EnableToolsAction([toolId]) : new EnableDefaultToolsAction();
      this.dispatchAction([action]);
      this.changeActiveButton(button);
      button.focus();
    };
  }

  private dispatchAction(action: Action[]): void {
    this.actionDispatcher.dispatchAll(
      action.concat(new SetUIExtensionVisibilityAction(QuickActionUI.ID, true, [...this.selectionService.getSelectedElementIDs()]))
    );
  }

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
    this.bodyDiv!.classList.add(COLLAPSED_CSS);
  }

  handle(action: Action): ICommand | Action | void {
    if (action.kind === EnableToolPaletteAction.KIND) {
      const requestAction = new RequestContextActions(ToolPalette.ID, {
        selectedElementIds: []
      });
      this.actionDispatcher.requestUntil(requestAction).then(response => {
        if (isSetContextActionsAction(response)) {
          this.paletteItems = response.actions.map(e => e as PaletteItem);
          this.actionDispatcher.dispatch(new SetUIExtensionVisibilityAction(ToolPalette.ID, true));
        }
      });
    } else if (action instanceof EnableDefaultToolsAction) {
      this.changeActiveButton();
      this.restoreFocus();
    }
  }

  editModeChanged(_oldValue: string, _newValue: string): void {
    this.actionDispatcher.dispatch(new SetUIExtensionVisibilityAction(ToolPalette.ID, true));
  }

  selectionChanged(root: Readonly<SModelRoot>, selectedElements: string[]): void {
    if (this.editorContext.isReadonly) {
      return;
    }
    this.showDynamicBtn(this.wrapToSubToolButton, selectedElements.length > 0);
    this.showDynamicBtn(this.deleteToolButton, selectedElements.length > 0);
    this.showDynamicBtn(this.autoAlignButton, selectedElements.length > 1);
  }

  protected clearOnEscape(event: KeyboardEvent): void {
    if (matchesKeystroke(event, 'Escape')) {
      this.searchField.value = '';
      this.requestFilterUpdate('');
    }
  }

  protected clearToolOnEscape(event: KeyboardEvent): void {
    if (matchesKeystroke(event, 'Escape')) {
      this.actionDispatcher.dispatch(new EnableDefaultToolsAction());
    }
  }

  protected handleSetContextActions(action: SetContextActions): void {
    this.paletteItems = action.actions.map(e => e as PaletteItem);
    if (this.bodyDiv) {
      this.createItemsDiv(this.bodyDiv);
    }
  }

  protected requestFilterUpdate(filter: string): void {
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
        const matchingChildren = itemGroup.children.filter(child => child.label.toLowerCase().includes(filter.toLowerCase()));
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

  private showGroup(groupId: string): void {
    this.bodyDiv!.classList.remove(COLLAPSED_CSS);
    Array.from(this.bodyDiv!.getElementsByClassName('tool-group')).forEach(element => {
      if (element.id === groupId) {
        element.classList.remove(COLLAPSED_CSS);
      } else {
        element.classList.add(COLLAPSED_CSS);
      }
    });
  }
}

export function compare(a: PaletteItem, b: PaletteItem): number {
  const sortStringBased = a.sortString.localeCompare(b.sortString);
  if (sortStringBased !== 0) {
    return sortStringBased;
  }
  return a.label.localeCompare(b.label);
}

export function createIcon(cssClasses: string[]): HTMLElement {
  const icon = document.createElement('i');
  const classes = cssClasses.map(cssClass => cssClass.split(' ')).flat();
  icon.classList.add(...classes);
  return icon;
}

export function createToolGroup(item: PaletteItem): HTMLElement {
  const group = document.createElement('div');
  group.classList.add('tool-group');
  group.id = item.id;
  const header = document.createElement('div');
  header.classList.add('group-header');
  if (item.icon) {
    header.appendChild(createIcon([item.icon]));
  }
  header.insertAdjacentText('beforeend', item.label);
  header.ondblclick = _ev => {
    changeCSSClass(group, COLLAPSED_CSS);
    window!.getSelection()!.removeAllRanges();
  };

  group.appendChild(header);
  return group;
}

export function changeCSSClass(element: Element, css: string): void {
  element.classList.contains(css) ? element.classList.remove(css) : element.classList.add(css);
}
