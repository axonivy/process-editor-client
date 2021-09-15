import {
  EditModeListener,
  EditorContextService,
  GLSPActionDispatcher,
  isSetContextActionsAction,
  RequestContextActions,
  RequestMarkersAction,
  SetContextActions
} from '@eclipse-glsp/client';
import { MarqueeMouseTool } from '@eclipse-glsp/client/lib/features/tools/marquee-mouse-tool';
import { inject, injectable, postConstruct } from 'inversify';
import {
  AbstractUIExtension,
  Action,
  EnableDefaultToolsAction,
  EnableToolsAction,
  IActionHandler,
  ICommand,
  IToolManager,
  SetUIExtensionVisibilityAction,
  SModelRoot,
  TYPES
} from 'sprotty';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';

import { PaletteItem } from './palette-item';

const CLICKED_CSS_CLASS = 'clicked';
const COLLAPSED_CSS = 'collapsed';

@injectable()
export class EnableToolPaletteAction implements Action {
  static readonly KIND = 'enableToolPalette';
  readonly kind = EnableToolPaletteAction.KIND;
}

@injectable()
export class ToolPalette extends AbstractUIExtension implements IActionHandler, EditModeListener {
  static readonly ID = 'ivy-tool-palette';

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;
  @inject(TYPES.IToolManager) protected readonly toolManager: IToolManager;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;

  // @inject(TYPES.ModelRendererFactory) private readonly render: ModelRenderer;
  // @inject(TYPES.ViewRegistry) private readonly viewRegistry: ViewRegistry;
  // @inject(TYPES.PatcherProvider) patcherProvider: PatcherProvider;

  protected paletteItems: PaletteItem[];
  protected paletteItemsCopy: PaletteItem[] = [];
  protected bodyDiv?: HTMLElement;
  protected itemsDiv?: HTMLElement;
  protected lastActivebutton?: HTMLElement;
  protected defaultToolsButton: HTMLElement;
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
  }

  protected createBody(): void {
    // const ele = new EventNode();
    // ele.id = 'id';
    // ele.type = 'type';
    // ele.bounds = { x: 0, y: 0, width: 20, height: 20 };
    // ele.args = { iconUri: 'std:NoDecorator' };
    // this.render.renderChildren = (element: any): any => [];
    // const vnode = this.viewRegistry.get(ActivityTypes.DB).render(ele, this.render);
    const bodyDiv = document.createElement('div');
    // const svg = document.createElement('svg');
    // svg.style.width = '25px';
    // svg.style.height = '25px';
    // svg.style.display = 'block';
    // const g = document.createElement('g');
    // svg.appendChild(g);
    // bodyDiv.appendChild(svg);
    // if (vnode) {
    //   this.patcherProvider.patcher(g, vnode);
    // }
    this.containerElement.appendChild(bodyDiv);
    bodyDiv.classList.add('palette-body', 'collapsible-palette', COLLAPSED_CSS);
    bodyDiv.appendChild(this.searchField = this.createPaletteItemSearchField());
    this.bodyDiv = bodyDiv;
    this.createItemsDiv(bodyDiv);
  }

  private createItemsDiv(bodyDiv: HTMLElement): void {
    const itemsDiv = document.createElement('div');
    let tabIndex = 0;
    this.paletteItems.sort(compare)
      .forEach(item => {
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
    headerCompartment.appendChild(this.createElementPickers());
    this.containerElement.appendChild(headerCompartment);
  }

  private createElementPickers(): HTMLElement {
    const elementPickers = document.createElement('div');
    elementPickers.classList.add('element-pickers');

    this.paletteItems.sort(compare)
      .forEach(item => {
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

    // const deleteToolButton = this.createMouseDeleteToolButton();
    // headerTools.appendChild(deleteToolButton);

    const marqueeToolButton = this.createMarqueeToolButton();
    headerTools.appendChild(marqueeToolButton);

    const validateActionButton = this.createValidateButton();
    headerTools.appendChild(validateActionButton);

    return headerTools;
  }

  protected createDefaultToolButton(): HTMLElement {
    const button = createIcon(['fas', 'fa-mouse-pointer', 'fa-xs', 'clicked']);
    button.id = 'btn_default_tools';
    button.title = 'Enable selection tool';
    button.onclick = this.onClickStaticToolButton(this.defaultToolsButton);
    return button;
  }

  // protected createMouseDeleteToolButton(): HTMLElement {
  //   const deleteToolButton = createIcon(['fas', 'fa-eraser', 'fa-xs']);
  //   deleteToolButton.title = 'Enable deletion tool';
  //   deleteToolButton.onclick = this.onClickStaticToolButton(deleteToolButton, MouseDeleteTool.ID);
  //   return deleteToolButton;
  // }

  protected createMarqueeToolButton(): HTMLElement {
    const marqueeToolButton = createIcon(['far', 'fa-object-group', 'fa-xs']);
    marqueeToolButton.title = 'Enable marquee tool';
    marqueeToolButton.onclick = this.onClickStaticToolButton(marqueeToolButton, MarqueeMouseTool.ID);
    return marqueeToolButton;
  }

  protected createValidateButton(): HTMLElement {
    const validateActionButton = createIcon(['fas', 'fa-check-square', 'fa-xs']);
    validateActionButton.title = 'Validate model';
    validateActionButton.onclick = _event => {
      const modelIds: string[] = [this.modelRootId];
      this.actionDispatcher.dispatch(new RequestMarkersAction(modelIds));
    };
    return validateActionButton;
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
    if (item.icon) {
      button.appendChild(createIcon(['fa', item.icon]));
    }
    button.insertAdjacentText('beforeend', item.label);
    button.onclick = this.onClickCreateToolButton(button, item);
    button.onkeydown = ev => this.clearToolOnEscape(ev);
    return button;
  }

  protected onClickCreateToolButton(button: HTMLElement, item: PaletteItem) {
    return (_ev: MouseEvent) => {
      if (!this.editorContext.isReadonly) {
        this.actionDispatcher.dispatchAll(item.actions);
        this.changeActiveButton(button);
        button.focus();
      }
    };
  }

  protected onClickStaticToolButton(button: HTMLElement, toolId?: string) {
    return (_ev: MouseEvent) => {
      if (!this.editorContext.isReadonly) {
        const action = toolId ? new EnableToolsAction([toolId]) : new EnableDefaultToolsAction();
        this.actionDispatcher.dispatch(action);
        this.changeActiveButton(button);
        button.focus();
      }
    };
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
          this.actionDispatcher.dispatch(new SetUIExtensionVisibilityAction(ToolPalette.ID, !this.editorContext.isReadonly));
        }
      });
    } else if (action instanceof EnableDefaultToolsAction) {
      this.changeActiveButton();
      this.restoreFocus();
    }
  }

  editModeChanged(_oldValue: string, _newValue: string): void {
    this.actionDispatcher.dispatch(new SetUIExtensionVisibilityAction(ToolPalette.ID, !this.editorContext.isReadonly));
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
  element.classList.contains(css) ? element.classList.remove(css) :
    element.classList.add(css);
}
