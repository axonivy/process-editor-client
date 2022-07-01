import {
  AbstractUIExtension,
  Action,
  Bounds,
  BoundsAware,
  EditorContextService,
  findParentByFeature,
  getAbsoluteBounds,
  IActionDispatcherProvider,
  isNotUndefined,
  isReconnectable,
  MouseListener,
  MouseTool,
  Point,
  SEdge,
  SetUIExtensionVisibilityAction,
  SModelElement,
  SModelRoot,
  SRoutableElement,
  TYPES
} from '@eclipse-glsp/client';
import { SelectionListener, SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { inject, injectable, multiInject, postConstruct } from 'inversify';
import { createIcon } from '../tool-bar/tool-bar-helper';

import { Edge, LaneNode } from '../diagram/model';
import { isQuickActionAware } from './model';
import { CategoryQuickActionProvider, QuickAction, QuickActionLocation, QuickActionProvider } from './quick-action';
import { IVY_TYPES } from '../types';
import { CreateNodeUi } from './node/create-node-ui';

@injectable()
export class QuickActionUI extends AbstractUIExtension implements SelectionListener {
  static readonly ID = 'quickActionsUi';
  private lastCursorPosition: Point;
  private activeQuickActions: QuickAction[] = [];

  @inject(TYPES.IActionDispatcherProvider) public actionDispatcherProvider: IActionDispatcherProvider;
  @inject(TYPES.SelectionService) protected selectionService: SelectionService;
  @inject(TYPES.MouseTool) protected mouseTool: MouseTool;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;
  @inject(IVY_TYPES.CategoryQuickActionProvider) protected categoryQuickActionProvider: CategoryQuickActionProvider;
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
  }

  selectionChanged(root: Readonly<SModelRoot>, selectedElements: string[]): void {
    if (selectedElements.length < 1) {
      this.hideUi();
    } else {
      this.showUi();
    }
  }

  public showUi(): void {
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
    this.actionDispatcherProvider().then(actionDispatcher =>
      actionDispatcher.dispatch(SetUIExtensionVisibilityAction.create({ extensionId: CreateNodeUi.ID, visible: false }))
    );
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

  public setCursorPosition(point: Point): void {
    this.lastCursorPosition = point;
  }

  private showMultiQuickActionUi(containerElement: HTMLElement, elements: SModelElement[]): void {
    const selectionBounds = elements.map(e => getAbsoluteBounds(e)).reduce((b1, b2) => Bounds.combine(b1, b2));
    containerElement.style.left = `${selectionBounds.x}px`;
    containerElement.style.top = `${selectionBounds.y}px`;

    const selectionDiv = document.createElement('div');
    selectionDiv.className = 'multi-selection-box';
    selectionDiv.style.height = `${selectionBounds.height + 10}px`;
    selectionDiv.style.width = `${selectionBounds.width + 10}px`;
    containerElement.appendChild(selectionDiv);

    const quickActions = this.quickActionProviders.map(provider => provider.multiQuickAction(elements)).filter(isNotUndefined);
    this.createQuickActions(containerElement, selectionBounds, quickActions, false);
  }

  private showSingleQuickActionUi(containerElement: HTMLElement, element: SModelElement & BoundsAware): void {
    if (isNotUndefined(element)) {
      const absoluteBounds = getAbsoluteBounds(element);
      containerElement.style.left = `${absoluteBounds.x}px`;
      containerElement.style.top = `${absoluteBounds.y}px`;

      const quickActions = this.quickActionProviders.map(provider => provider.singleQuickAction(element)).filter(isNotUndefined);
      quickActions.push(...this.categoryQuickActionProvider.categoryQuickActions(element));
      this.createQuickActions(containerElement, absoluteBounds, quickActions, element instanceof LaneNode);
    }
  }

  private showEdgeQuickActionUi(containerElement: HTMLElement, element: SEdge): void {
    if (isNotUndefined(element) && !element.id.endsWith('_feedback_edge')) {
      const absoluteBounds = { x: this.lastCursorPosition.x, y: this.lastCursorPosition.y, height: 0, width: 0 };
      containerElement.style.left = `${absoluteBounds.x}px`;
      containerElement.style.top = `${absoluteBounds.y}px`;

      const quickActions = this.quickActionProviders.map(provider => provider.singleQuickAction(element)).filter(isNotUndefined);
      this.createQuickActions(containerElement, absoluteBounds, quickActions, element instanceof LaneNode);
    }
  }

  private createQuickActions(containerElement: HTMLElement, absoluteBounds: Bounds, quickActions: QuickAction[], inline: boolean): void {
    this.activeQuickActions = quickActions.filter(quickAction => !this.isReadonly() || quickAction.readonlySupport);
    Object.values(QuickActionLocation)
      .filter(loc => loc !== QuickActionLocation.Hidden)
      .forEach(loc => {
        this.activeQuickActions
          .filter(quickAction => quickAction.location === loc)
          .sort((a, b) => a.sorting.localeCompare(b.sorting))
          .forEach((quickAction, position) => {
            const buttonPos = this.getPosition(absoluteBounds, quickAction.location, position, inline);
            containerElement.appendChild(this.createQuickActionBtn(quickAction, buttonPos));
          });
      });
  }

  private createQuickActionBtn(quickAction: QuickAction, position: Point): HTMLElement {
    const button = document.createElement('span');
    button.appendChild(createIcon([quickAction.icon, 'fa-xs', 'fa-fw']));
    button.title = quickAction.title;
    let actions = [SetUIExtensionVisibilityAction.create({ extensionId: QuickActionUI.ID, visible: false }), quickAction.action];
    if (quickAction.letQuickActionsOpen) {
      actions = [quickAction.action];
    }
    button.onclick = () => this.actionDispatcherProvider().then(dispatcher => dispatcher.dispatchAll(actions));
    button.style.left = `${position.x}px`;
    button.style.top = `${position.y}px`;
    return button;
  }

  protected getPosition(parentDimension: Bounds, location: QuickActionLocation, position: number, inline: boolean): Point {
    if (inline) {
      if (location === QuickActionLocation.TopLeft) {
        return { x: 3 + position * 32, y: 3 };
      } else if (location === QuickActionLocation.BottomLeft) {
        return { x: 3 + position * 32, y: parentDimension.height - 27 };
      }
    }
    if (location === QuickActionLocation.TopLeft) {
      return { x: -30 + position * 32, y: -30 };
    } else if (location === QuickActionLocation.Left) {
      return { x: -30, y: parentDimension.height / 2 - 11 };
    } else if (location === QuickActionLocation.Right) {
      return { x: parentDimension.width + 10 + (position % 3) * 32, y: ((position / 3) | 0) * 32 };
    } else if (location === QuickActionLocation.BottomLeft) {
      return { x: -30 + position * 32, y: parentDimension.height + 10 };
    }
    return Point.ORIGIN;
  }

  protected isReadonly(): boolean {
    return this.editorContext.isReadonly;
  }
}

export class QuickActionUiMouseListener extends MouseListener {
  mouseActive: boolean;
  constructor(private quickActionUi: QuickActionUI) {
    super();
  }

  mouseDown(target: SModelElement, event: MouseEvent): Action[] {
    this.mouseActive = true;
    return [];
  }

  mouseMove(target: SModelElement, event: MouseEvent): Action[] {
    if (this.mouseActive) {
      this.quickActionUi.hideUi();
    }
    return [];
  }

  mouseUp(target: SModelElement, event: MouseEvent): Action[] {
    if (this.mouseActive && findParentByFeature(target, isReconnectable)) {
      this.quickActionUi.setCursorPosition({ x: event.pageX, y: event.pageY });
      this.quickActionUi.showUi();
    }
    this.mouseActive = false;
    return [];
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
