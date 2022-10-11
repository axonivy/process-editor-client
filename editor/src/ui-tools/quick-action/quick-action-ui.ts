import {
  AbstractUIExtension,
  Action,
  Bounds,
  BoundsAware,
  CursorCSS,
  EditorContextService,
  getAbsoluteBounds,
  IActionDispatcher,
  IActionDispatcherProvider,
  IActionHandler,
  ICommand,
  isNotUndefined,
  MouseListener,
  MouseTool,
  SChildElement,
  SConnectableElement,
  SEdge,
  SelectAllAction,
  SetUIExtensionVisibilityAction,
  SModelElement,
  SModelRoot,
  SRoutableElement,
  TYPES
} from '@eclipse-glsp/client';
import { SelectionListener, SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { inject, injectable, multiInject, postConstruct } from 'inversify';
import { createElement, createIcon } from '../../utils/ui-utils';

import { Edge } from '../../diagram/model';
import { isQuickActionAware } from './model';
import { QuickAction, QuickActionLocation, QuickActionProvider } from './quick-action';
import { IVY_TYPES } from '../../types';
import { QuickActionMenu, ShowQuickActionMenuAction, ShowInfoQuickActionMenuAction, InfoQuickActionMenu } from './quick-action-menu-ui';
import { Menu } from '../menu/menu';
import { RemoveMarqueeAction } from '@eclipse-glsp/client/lib/features/tool-feedback/marquee-tool-feedback';

@injectable()
export class QuickActionUI extends AbstractUIExtension implements IActionHandler, SelectionListener {
  static readonly ID = 'quickActionsUi';
  private activeQuickActions: QuickAction[] = [];
  private activeQuickActionBtn?: HTMLElement;
  private quickActionBar?: HTMLElement;
  private quickActionMenu?: Menu;

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;
  @inject(TYPES.IActionDispatcherProvider) public actionDispatcherProvider: IActionDispatcherProvider;
  @inject(TYPES.SelectionService) protected selectionService: SelectionService;
  @inject(TYPES.MouseTool) protected mouseTool: MouseTool;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;
  @multiInject(IVY_TYPES.QuickActionProvider) protected quickActionProviders: QuickActionProvider[];

  public id(): string {
    return QuickActionUI.ID;
  }

  public containerClass(): string {
    return 'quick-actions-container';
  }

  public getActiveQuickActions(): QuickAction[] {
    return this.activeQuickActions;
  }

  @postConstruct()
  postConstruct(): void {
    this.selectionService.register(this);
    const mouseListener = new QuickActionUiMouseListener(this);
    this.mouseTool.register(mouseListener);
  }

  protected initializeContents(containerElement: HTMLElement): void {
    containerElement.style.position = 'absolute';
    containerElement.onwheel = ev => (ev.ctrlKey ? ev.preventDefault() : true);
  }

  selectionChanged(root: Readonly<SModelRoot>, selectedElements: string[]): void {
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

  private showItemMenu(action: ShowQuickActionMenuAction): void {
    this.removeMenu();
    if (action.elementIds.length > 0) {
      this.quickActionMenu = new QuickActionMenu(this.actionDispatcher, action);
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
      }
      this.shiftBar(menu, 8);
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

  hide(): void {
    super.hide();
  }

  protected onBeforeShow(containerElement: HTMLElement, root: Readonly<SModelRoot>, ...contextElementIds: string[]): void {
    containerElement.innerHTML = '';
    const elements = getElements(contextElementIds, root);
    const elementsWithoutEdges = elements.filter(e => !(e instanceof SRoutableElement) || !(e instanceof Edge));
    if (elementsWithoutEdges.length > 1) {
      this.showMultiQuickActionUi(containerElement, elementsWithoutEdges);
    } else if (elements.length === 1 && elements[0] instanceof SEdge && isQuickActionAware(elements[0])) {
      this.showEdgeQuickActionUi(containerElement, elements[0]);
    } else {
      const element = getFirstQuickActionElement(elementsWithoutEdges, root);
      this.showSingleQuickActionUi(containerElement, element);
    }
  }

  private showMultiQuickActionUi(containerElement: HTMLElement, elements: SModelElement[]): void {
    this.activeQuickActions = this.loadMultiQuickActions(elements);
    if (this.activeQuickActions.length === 0) {
      return;
    }
    const selectionBounds = elements.map(e => getAbsoluteBounds(e)).reduce((b1, b2) => Bounds.combine(b1, b2));
    this.quickActionBar = this.createQuickActionsBar(containerElement, selectionBounds, true);
    this.createQuickActions(this.quickActionBar, this.activeQuickActions);
    this.shiftBar(this.quickActionBar);
  }

  private showSingleQuickActionUi(containerElement: HTMLElement, element: SModelElement & BoundsAware): void {
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

  private showEdgeQuickActionUi(containerElement: HTMLElement, edge: SEdge): void {
    if (isNotUndefined(edge) && !edge.id.endsWith('_feedback_edge') && edge.source && edge.target) {
      this.activeQuickActions = this.loadSingleQuickActions(edge);
      if (this.activeQuickActions.length === 0) {
        return;
      }
      const absoluteBounds = getAbsoluteEdgeBounds(edge, edge.source, edge.target);
      this.quickActionBar = this.createQuickActionsBar(containerElement, absoluteBounds);
      this.createQuickActions(this.quickActionBar, this.activeQuickActions);
      this.shiftBar(this.quickActionBar);
    }
  }

  private shiftBar(bar: HTMLElement, distanceToWindow = 16): void {
    const bounds = bar.getBoundingClientRect();
    let shift = bounds.width / 2;
    const maxShift = bounds.x - distanceToWindow;
    if (shift > maxShift) {
      shift = maxShift;
    }
    const minShift = bounds.x + bounds.width + distanceToWindow - shift;
    if (minShift > window.innerWidth) {
      shift += minShift - window.innerWidth;
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
    Object.values(QuickActionLocation)
      .filter(location => location !== QuickActionLocation.Hidden)
      .forEach(location => {
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
      });
  }

  private createQuickActionBtn(quickAction: QuickAction): HTMLElement {
    const button = createElement('span');
    button.appendChild(createIcon(['si', `si-${quickAction.icon}`]));
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

  private loadSingleQuickActions(element: SModelElement): QuickAction[] {
    return this.filterQuickActions(this.quickActionProviders.map(provider => provider.singleQuickAction(element)));
  }

  private loadMultiQuickActions(elements: SModelElement[]): QuickAction[] {
    return this.filterQuickActions(this.quickActionProviders.map(provider => provider.multiQuickAction(elements)));
  }

  private filterQuickActions(quickActions: (QuickAction | undefined)[]): QuickAction[] {
    return quickActions.filter(isNotUndefined).filter(quickAction => !this.isReadonly() || quickAction.readonlySupport);
  }

  protected isReadonly(): boolean {
    return this.editorContext.isReadonly;
  }
}

class QuickActionUiMouseListener extends MouseListener {
  constructor(private quickActionUi: QuickActionUI) {
    super();
  }

  wheel(target: SModelElement, event: WheelEvent): Action[] {
    this.quickActionUi.showUi();
    return [];
  }
}

function getElements(contextElementIds: string[], root: Readonly<SModelRoot>): SModelElement[] {
  return contextElementIds.map(id => root.index.getById(id)).filter(isNotUndefined);
}

function getFirstQuickActionElement(elements: SModelElement[], root: Readonly<SModelRoot>): SModelElement & BoundsAware {
  return elements.filter(isQuickActionAware)[0];
}

function getAbsoluteEdgeBounds(edge: SEdge, source: SConnectableElement, target: SConnectableElement): Bounds {
  const edgePoints: Bounds[] = [];
  const EMPTY_EDGE_BOUNDS = { x: 0, y: 0, width: 0, height: 0 };
  edgePoints.push(Bounds.translate(EMPTY_EDGE_BOUNDS, Bounds.center(source.bounds)));
  edgePoints.push(...edge.routingPoints.map(point => Bounds.translate(EMPTY_EDGE_BOUNDS, { x: point.x, y: point.y })));
  edgePoints.push(Bounds.translate(EMPTY_EDGE_BOUNDS, Bounds.center(target.bounds)));
  let bounds = edgePoints.reduce((b1, b2) => Bounds.combine(b1, b2)) as Bounds;
  let current: SModelElement = edge;
  while (current instanceof SChildElement) {
    const parent = current.parent;
    bounds = parent.localToParent(bounds);
    current = parent;
  }
  return bounds;
}
