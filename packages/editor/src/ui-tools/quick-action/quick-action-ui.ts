import {
  Action,
  Bounds,
  BoundsAware,
  CursorCSS,
  EditorContextService,
  GEdge,
  GLSPAbstractUIExtension,
  GLSPMouseTool,
  GModelElement,
  GModelRoot,
  GRoutableElement,
  IActionDispatcherProvider,
  IActionHandler,
  ICommand,
  ISelectionListener,
  MouseListener,
  RemoveMarqueeAction,
  SelectAllAction,
  SelectionService,
  SetUIExtensionVisibilityAction,
  TYPES,
  getAbsoluteBounds,
  isNotUndefined
} from '@eclipse-glsp/client';
import { inject, injectable, multiInject, postConstruct } from 'inversify';
import { createElement, createIcon } from '../../utils/ui-utils';

import { Edge, EdgeLabel } from '../../diagram/model';
import { IVY_TYPES } from '../../types';
import { getAbsoluteEdgeBounds } from '../../utils/diagram-utils';
import { Menu } from '../menu/menu';
import { isQuickActionAware } from './model';
import { QuickAction, QuickActionLocation, QuickActionProvider } from './quick-action';
import { InfoQuickActionMenu, QuickActionMenu, ShowInfoQuickActionMenuAction, ShowQuickActionMenuAction } from './quick-action-menu-ui';

@injectable()
export class QuickActionUI extends GLSPAbstractUIExtension implements IActionHandler, ISelectionListener {
  static readonly ID = 'quickActionsUi';
  private activeQuickActions: QuickAction[] = [];
  private activeQuickActionBtn?: HTMLElement;
  private quickActionBar?: HTMLElement;
  private quickActionMenu?: Menu;

  @inject(TYPES.IActionDispatcherProvider) public actionDispatcherProvider: IActionDispatcherProvider;
  @inject(SelectionService) protected selectionService: SelectionService;
  @inject(GLSPMouseTool) protected mouseTool: GLSPMouseTool;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;
  @multiInject(IVY_TYPES.QuickActionProvider) protected quickActionProviders: QuickActionProvider[];

  public id(): string {
    return QuickActionUI.ID;
  }

  @postConstruct()
  protected init(): void {
    this.selectionService.onSelectionChanged(event => this.selectionChanged(event.root, event.selectedElements));
    this.mouseTool.register(new QuickActionUiMouseListener(this));
  }

  public containerClass(): string {
    return 'quick-actions-container';
  }

  public getActiveQuickActions(): QuickAction[] {
    return this.activeQuickActions;
  }

  protected initializeContents(containerElement: HTMLElement): void {
    containerElement.style.position = 'absolute';
    containerElement.onwheel = ev => (ev.ctrlKey ? ev.preventDefault() : true);
  }

  selectionChanged(root: Readonly<GModelRoot>, selectedElements: string[]): void {
    if (this.editorContext.modelRoot.cssClasses?.includes(CursorCSS.MARQUEE) || selectedElements.length < 1) {
      this.hideUi();
    } else {
      this.showUi();
    }
  }

  handle(action: Action): void | Action | ICommand {
    if (ShowQuickActionMenuAction.is(action)) {
      this.showItemMenu(action);
    }
    if (ShowInfoQuickActionMenuAction.is(action)) {
      this.showSimpleMenu(action);
    }
    if (RemoveMarqueeAction.is(action) && this.editorContext.selectedElements.length > 0) {
      this.showUi();
    }
  }

  private showSimpleMenu(action: ShowInfoQuickActionMenuAction): void {
    this.removeMenu();
    this.quickActionMenu = new InfoQuickActionMenu(action);
    this.createMenu(this.quickActionMenu);
  }

  private async showItemMenu(action: ShowQuickActionMenuAction): Promise<void> {
    this.removeMenu();
    if (action.elementIds.length > 0) {
      this.quickActionMenu = new QuickActionMenu(await this.actionDispatcherProvider(), action);
      this.createMenu(this.quickActionMenu);
    } else {
      this.setActiveQuickActionBtn();
    }
  }

  private createMenu(quickActionMenu: Menu): void {
    if (this.quickActionBar) {
      const menu = quickActionMenu.create(this.containerElement);
      if (menu.offsetWidth > this.quickActionBar.offsetWidth) {
        menu.classList.add('border-radius');
        this.quickActionBar.classList.add('no-bottom-border-radius');
        this.shiftBar(menu, 8);
      } else {
        this.shiftBar(menu, 24);
      }
    }
  }

  private removeMenu(): void {
    this.quickActionMenu?.remove();
    this.quickActionMenu = undefined;
  }

  public showUi(): void {
    this.activeQuickActions = [];
    this.actionDispatcherProvider().then(actionDispatcher =>
      actionDispatcher.dispatch(
        SetUIExtensionVisibilityAction.create({
          extensionId: QuickActionUI.ID,
          visible: true,
          contextElementsId: [...this.selectionService.getSelectedElementIDs()]
        })
      )
    );
  }

  public hideUi(): void {
    this.activeQuickActions = [];
    this.actionDispatcherProvider().then(actionDispatcher =>
      actionDispatcher.dispatch(SetUIExtensionVisibilityAction.create({ extensionId: QuickActionUI.ID, visible: false }))
    );
  }

  protected onBeforeShow(containerElement: HTMLElement, root: Readonly<GModelRoot>, ...contextElementIds: string[]): void {
    containerElement.innerHTML = '';
    const elements = getElements(contextElementIds, root);
    const elementsWithoutEdges = elements.filter(e => !(e instanceof GRoutableElement) || !(e instanceof Edge));
    if (elementsWithoutEdges.length > 1) {
      this.showMultiQuickActionUi(containerElement, elementsWithoutEdges);
    } else if (elements.length === 1 && elements[0] instanceof GEdge && isQuickActionAware(elements[0])) {
      this.showEdgeQuickActionUi(containerElement, elements[0]);
    } else {
      const element = getFirstQuickActionElement(elementsWithoutEdges, root);
      this.showSingleQuickActionUi(containerElement, element);
    }
  }

  private showMultiQuickActionUi(containerElement: HTMLElement, elements: GModelElement[]): void {
    this.activeQuickActions = this.loadMultiQuickActions(elements);
    if (this.activeQuickActions.length === 0) {
      return;
    }

    // skip edge labels as they have bounds that do not actually match their rendering
    const selectionBounds = elements
      .filter(element => !(element instanceof EdgeLabel))
      .map(getAbsoluteBounds)
      .filter(Bounds.isValid)
      .reduce(Bounds.combine);
    this.quickActionBar = this.createQuickActionsBar(containerElement, selectionBounds, true);
    this.createQuickActions(this.quickActionBar, this.activeQuickActions);
    this.shiftBar(this.quickActionBar);
  }

  private showSingleQuickActionUi(containerElement: HTMLElement, element: GModelElement & BoundsAware): void {
    if (isNotUndefined(element)) {
      this.activeQuickActions = this.loadSingleQuickActions(element);
      if (this.activeQuickActions.length === 0) {
        return;
      }
      this.quickActionBar = this.createQuickActionsBar(containerElement, getAbsoluteBounds(element));
      this.createQuickActions(this.quickActionBar, this.activeQuickActions);
      this.shiftBar(this.quickActionBar);
    }
  }

  private showEdgeQuickActionUi(containerElement: HTMLElement, edge: GEdge): void {
    if (isNotUndefined(edge) && !edge.id.endsWith('_feedback_edge') && edge.source && edge.target) {
      this.activeQuickActions = this.loadSingleQuickActions(edge);
      if (this.activeQuickActions.length === 0) {
        return;
      }
      const absoluteBounds = getAbsoluteEdgeBounds(edge);
      this.quickActionBar = this.createQuickActionsBar(containerElement, absoluteBounds);
      this.createQuickActions(this.quickActionBar, this.activeQuickActions);
      this.shiftBar(this.quickActionBar);
    }
  }

  private shiftBar(bar: HTMLElement, distanceToWindow = 16): void {
    const bounds = bar.getBoundingClientRect();
    let shift = bounds.width / 2;
    const minShift = bounds.x + bounds.width + distanceToWindow - shift;
    const diagramDiv = this.getParentContainer()!;
    if (minShift > diagramDiv.offsetWidth) {
      shift += minShift - diagramDiv.offsetWidth;
    }
    const maxShift = bounds.x - distanceToWindow;
    if (shift > maxShift) {
      shift = maxShift;
    }
    bar.style.marginLeft = `${-shift}px`;
  }

  private createQuickActionsBar(containerElement: HTMLElement, parentBounds: Bounds, drawSelectionBox = false): HTMLElement {
    containerElement.style.left = `${parentBounds.x + parentBounds.width / 2}px`;
    containerElement.style.top = `${parentBounds.y + parentBounds.height}px`;
    if (drawSelectionBox) {
      const selectionDiv = createElement('div', ['multi-selection-box']);
      selectionDiv.style.marginLeft = `-${parentBounds.width / 2}px`;
      selectionDiv.style.marginTop = `-${parentBounds.height}px`;
      selectionDiv.style.height = `${parentBounds.height + 10}px`;
      selectionDiv.style.width = `${parentBounds.width + 10}px`;
      containerElement.appendChild(selectionDiv);
    }
    const bar = createElement('div', ['quick-actions-bar']);
    containerElement.appendChild(bar);
    return bar;
  }

  private createQuickActions(bar: HTMLElement, quickActions: QuickAction[]): void {
    this.createQuickActionGroup(bar, quickActions, 'Left');
    this.createQuickActionGroup(bar, quickActions, 'Middle');
    this.createQuickActionGroup(bar, quickActions, 'Right');
    this.setContainerVisible(true);
  }

  private createQuickActionGroup(bar: HTMLElement, quickActions: QuickAction[], location: QuickActionLocation): void {
    const group = createElement('div', ['quick-actions-group']);
    quickActions
      .filter(quickAction => quickAction.location === location)
      .sort((a, b) => a.sorting.localeCompare(b.sorting))
      .forEach(quickAction => {
        group.appendChild(this.createQuickActionBtn(quickAction));
      });
    if (group.children.length > 0) {
      bar.appendChild(group);
    }
  }

  private createQuickActionBtn(quickAction: QuickAction): HTMLElement {
    const button = createElement('span');
    button.appendChild(createIcon(quickAction.icon));
    button.title = quickAction.title;
    const actions = [quickAction.action];
    if (!quickAction.letQuickActionsOpen) {
      actions.push(SetUIExtensionVisibilityAction.create({ extensionId: QuickActionUI.ID, visible: false }));
    }
    if (quickAction.removeSelection) {
      actions.push(SelectAllAction.create(false));
    }
    button.onclick = () => this.triggerQuickActionBtn(button, actions);
    return button;
  }

  private triggerQuickActionBtn(button: HTMLElement, actions: Action[]): void {
    if (this.activeQuickActionBtn === button && this.quickActionMenu) {
      this.setActiveQuickActionBtn();
      this.removeMenu();
    } else {
      this.setActiveQuickActionBtn(button);
      this.actionDispatcherProvider().then(dispatcher => dispatcher.dispatchAll(actions));
    }
  }

  private setActiveQuickActionBtn(button?: HTMLElement): void {
    this.activeQuickActionBtn?.classList.remove('active');
    this.activeQuickActionBtn = button;
    this.activeQuickActionBtn?.classList.add('active');
  }

  private loadSingleQuickActions(element: GModelElement): QuickAction[] {
    return this.filterQuickActions(this.quickActionProviders.map(provider => provider.singleQuickAction(element)));
  }

  private loadMultiQuickActions(elements: GModelElement[]): QuickAction[] {
    return this.filterQuickActions(this.quickActionProviders.map(provider => provider.multiQuickAction(elements)));
  }

  private filterQuickActions(quickActions: (QuickAction | undefined)[]): QuickAction[] {
    return quickActions.filter(isNotUndefined).filter(quickAction => !this.isReadonly() || quickAction.readonlySupport);
  }

  protected isReadonly(): boolean {
    return this.editorContext.isReadonly;
  }
}

export class QuickActionUiMouseListener extends MouseListener {
  constructor(private quickActionUi: QuickActionUI) {
    super();
  }

  wheel(target: GModelElement, event: WheelEvent): Action[] {
    this.quickActionUi.showUi();
    return [];
  }
}

function getElements(contextElementIds: string[], root: Readonly<GModelRoot>): GModelElement[] {
  return contextElementIds.map(id => root.index.getById(id)).filter(isNotUndefined);
}

function getFirstQuickActionElement(elements: GModelElement[], root: Readonly<GModelRoot>): GModelElement & BoundsAware {
  return elements.filter(isQuickActionAware)[0];
}
