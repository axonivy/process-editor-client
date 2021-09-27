import {
  AbstractUIExtension,
  Action,
  Bounds,
  BoundsAware,
  combine,
  Dimension,
  getAbsoluteBounds,
  GLSP_TYPES,
  IActionDispatcherProvider,
  isNotUndefined,
  ORIGIN_POINT,
  Point,
  SetUIExtensionVisibilityAction,
  SModelElement,
  SModelRoot,
  SRoutableElement,
  SShapeElement,
  TYPES
} from '@eclipse-glsp/client';
import { SelectionListener, SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { inject, injectable, multiInject, postConstruct } from 'inversify';

import { createIcon } from '../tool-palette/tool-palette';
import { isQuickActionAware } from './model';
import { IVY_TYPES, QuickAction, QuickActionLocation, QuickActionProvider } from './quick-action';

@injectable()
export class QuickActionUI extends AbstractUIExtension implements SelectionListener {
  static readonly ID = 'quickActionsUi';

  @inject(TYPES.IActionDispatcherProvider) public actionDispatcherProvider: IActionDispatcherProvider;
  @inject(GLSP_TYPES.SelectionService) protected selectionService: SelectionService;
  @multiInject(IVY_TYPES.QuickActionProvider) protected quickActionProviders: QuickActionProvider[];

  public id(): string {
    return QuickActionUI.ID;
  }

  public containerClass(): string {
    return 'quick-actions-container';
  }

  @postConstruct()
  postConstruct(): void {
    this.selectionService.register(this);
  }

  protected initializeContents(containerElement: HTMLElement): void {
    containerElement.style.position = 'absolute';
  }

  selectionChanged(root: Readonly<SModelRoot>, selectedElements: string[]): void {
    if (selectedElements.length >= 1) {
      this.actionDispatcherProvider().then(actionDispatcher =>
        actionDispatcher.dispatch(new SetUIExtensionVisibilityAction(QuickActionUI.ID, true, selectedElements)));
    } else {
      this.actionDispatcherProvider().then(actionDispatcher =>
        actionDispatcher.dispatch(new SetUIExtensionVisibilityAction(QuickActionUI.ID, false)));
    }
  }

  protected onBeforeShow(containerElement: HTMLElement, root: Readonly<SModelRoot>, ...contextElementIds: string[]): void {
    containerElement.innerHTML = '';
    if (contextElementIds.length > 1) {
      this.showMultiQuickActionUi(containerElement);
    } else {
      const element = getQuickActionsElement(contextElementIds, root)[0];
      this.showSingleQuickActionUi(containerElement, element);
    }
  }

  private showMultiQuickActionUi(containerElement: HTMLElement): void {
    const elements = (this.selectionService.getSelectedElements() as SShapeElement[])
      .filter(e => !(e instanceof SRoutableElement));
    const selectionBounds = elements.map(e => getAbsoluteBounds(e))
      .reduce((b1, b2) => combine(b1, b2));
    containerElement.style.left = `${selectionBounds.x}px`;
    containerElement.style.top = `${selectionBounds.y}px`;

    const selectionDiv = document.createElement('div');
    selectionDiv.className = 'multi-selection-box';
    selectionDiv.style.height = `${selectionBounds.height + 10}px`;
    selectionDiv.style.width = `${selectionBounds.width + 10}px`;
    containerElement.appendChild(selectionDiv);

    const quickActions = this.quickActionProviders
      .map(provider => provider.multiQuickAction(elements))
      .filter(isNotUndefined);
    this.createQuickActions(containerElement, selectionBounds, quickActions);
  }

  private showSingleQuickActionUi(containerElement: HTMLElement, element: SModelElement & BoundsAware): void {
    if (isNotUndefined(element)) {
      const absoluteBounds = getAbsoluteBounds(element);
      containerElement.style.left = `${absoluteBounds.x}px`;
      containerElement.style.top = `${absoluteBounds.y}px`;

      const quickActions = this.quickActionProviders
        .map(provider => provider.singleQuickAction(element))
        .filter(isNotUndefined);
      this.createQuickActions(containerElement, absoluteBounds, quickActions);
    }
  }

  private createQuickActions(containerElement: HTMLElement, absoluteBounds: Bounds, quickActions: QuickAction[]): void {
    Object.values(QuickActionLocation).forEach(loc => {
      quickActions.filter(quick => quick.location === loc)
        .sort((a, b) => a.sorting.localeCompare(b.sorting))
        .forEach((quick, position) => {
          const buttonPos = this.getPosition(absoluteBounds, quick.location, position);
          containerElement.appendChild(this.createQuickActionBtn(quick.icon, quick.title, buttonPos, quick.action));
        });
    });
  }

  private createQuickActionBtn(icon: string, title: string, position: Point, action: Action): HTMLElement {
    const button = createIcon(['fa', icon, 'fa-xs', 'fa-fw']);
    button.title = title;
    button.onclick = () => this.actionDispatcherProvider().then(dispatcher => dispatcher.dispatch(action));
    button.style.left = `${position.x}px`;
    button.style.top = `${position.y}px`;
    return button;
  }

  protected getPosition(parentDimension: Dimension, location: QuickActionLocation, position: number): Point {
    if (location === QuickActionLocation.TopLeft) {
      return { x: -30 + (position * 32), y: -30 };
    } else if (location === QuickActionLocation.Left) {
      return { x: -30, y: parentDimension.height / 2 - 11 };
    } else if (location === QuickActionLocation.Right) {
      return { x: parentDimension.width + 10, y: -30 + (position * 32) };
    } else if (location === QuickActionLocation.BottomLeft) {
      return { x: -30 + (position * 32), y: parentDimension.height + 10 };
    }
    return ORIGIN_POINT;
  }
}

function getQuickActionsElement(contextElementIds: string[], root: Readonly<SModelRoot>): (SModelElement & BoundsAware)[] {
  return contextElementIds.map(id => root.index.getById(id)).filter(isQuickActionAware);
}
