import {
  SModelElement,
  isConnectable,
  SEdge,
  Action,
  CreateNodeOperation,
  TriggerNodeCreationAction,
  SConnectableElement,
  PaletteItem,
  isNotUndefined,
  Operation,
  hasStringProp,
  SetUIExtensionVisibilityAction
} from '@eclipse-glsp/client';
import { injectable, inject } from 'inversify';
import { ActivityTypes } from '../../../diagram/view-types';

import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../quick-action';
import { KeyCode } from 'sprotty/lib/utils/keyboard';
import { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { ElementsPaletteHandler } from '../../tool-bar/node/action-handler';
import { canAddErrorBoundary, canAddSignalBoundary } from '../../../diagram/boundary/model';
import { QuickActionUI } from '../quick-action-ui';

export interface AttachBoundaryOperation extends Operation {
  kind: typeof AttachBoundaryOperation.KIND;
  elementId: string;
  eventKind: string;
}

export namespace AttachBoundaryOperation {
  export const KIND = 'attachBoundary';

  export function is(object: any): object is AttachBoundaryOperation {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'elementId') && hasStringProp(object, 'eventKind');
  }

  export function create(options: { elementId: string; eventKind: string }): AttachBoundaryOperation {
    return {
      kind: KIND,
      isOperation: true,
      ...options
    };
  }
}

export abstract class CreateElementQuickActionProvider extends SingleQuickActionProvider {
  @inject(ElementsPaletteHandler) protected paletteHandler: ElementsPaletteHandler;
  protected element: SModelElement;

  singleQuickAction(element: SModelElement): QuickAction | undefined {
    this.element = element;
    if (!isConnectable(element) || !element.canConnect(new SEdge(), 'source') || element.type === ActivityTypes.COMMENT) {
      return;
    }
    const hideItemsContaining = ['Start'];
    if (element instanceof SConnectableElement && Array.from(element.outgoingEdges).length > 0) {
      hideItemsContaining.push('End');
    }
    return this.createQuickAction(element, hideItemsContaining);
  }

  protected paletteItems(): () => PaletteItem[] {
    return () => this.paletteHandler.getPaletteItems();
  }

  protected actions = (paletteItem: PaletteItem, elementIds: string[]): Action[] => [
    SetUIExtensionVisibilityAction.create({ extensionId: QuickActionUI.ID, visible: false }),
    ...paletteItem.actions.map(itemAction => convertToCreateNodeOperation(itemAction, elementIds[0])).filter(isNotUndefined)
  ];

  protected quickActionItem(): PaletteItem {
    return { id: '', actions: [], label: '', sortString: '' };
  }

  abstract createQuickAction(element: SModelElement, hideItemsContaining: string[]): QuickAction | undefined;
}

@injectable()
export class CreateEventQuickActionProvider extends CreateElementQuickActionProvider {
  paletteItems(): () => PaletteItem[] {
    return () => {
      const items = [];
      const events = this.paletteHandler.getPaletteItems().find(item => item.id === 'event-group');
      if (events) {
        items.push(events);
      }
      const boundaries = boundaryEventGroup(this.element);
      if (boundaries) {
        items.push(boundaries);
      }
      return items;
    };
  }

  quickActionItem(): PaletteItem {
    return { label: 'Events', icon: 'fa-regular fa-circle', sortString: 'A', id: '', actions: [] };
  }

  createQuickAction(element: SModelElement, hideItemsContaining: string[]): QuickAction | undefined {
    return new CreateElementQuickAction(element.id, this.quickActionItem(), this.paletteItems(), this.actions, hideItemsContaining);
  }
}

@injectable()
export class CreateGatewayQuickActionProvider extends CreateElementQuickActionProvider {
  paletteItems(): () => PaletteItem[] {
    return () => this.paletteHandler.getPaletteItems().filter(item => item.id === 'gateway-group');
  }

  quickActionItem(): PaletteItem {
    return { label: 'Gateways', icon: 'fa-regular fa-square fa-rotate-45', sortString: 'B', id: '', actions: [] };
  }

  createQuickAction(element: SModelElement, hideItemsContaining: string[]): QuickAction | undefined {
    return new CreateElementQuickAction(element.id, this.quickActionItem(), this.paletteItems(), this.actions, hideItemsContaining);
  }
}

@injectable()
export class CreateActivityQuickActionProvider extends CreateElementQuickActionProvider {
  paletteItems(): () => PaletteItem[] {
    return () => {
      const items = this.paletteHandler.getPaletteItems();
      const activities = items.find(item => item.id === 'activity-group');
      const bpmnActivities = items.find(item => item.id === 'bpmn-activity-group');
      if (activities && bpmnActivities) {
        return [activities, bpmnActivities];
      }
      return [];
    };
  }

  quickActionItem(): PaletteItem {
    return { label: 'Activities', icon: 'fa-regular fa-square', sortString: 'C', id: '', actions: [] };
  }

  createQuickAction(element: SModelElement, hideItemsContaining: string[]): QuickAction | undefined {
    return new CreateElementQuickAction(element.id, this.quickActionItem(), this.paletteItems(), this.actions, hideItemsContaining);
  }
}

@injectable()
export class CreateAllElementsQuickActionProvider extends CreateElementQuickActionProvider {
  createQuickAction(element: SModelElement, hideItemsContaining: string[]): QuickAction | undefined {
    hideItemsContaining.push('Pool', 'Lane');
    return new CreateAllElementsQuickAction(element.id, this.paletteItems(), this.actions, hideItemsContaining);
  }
}

class CreateElementQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly item: PaletteItem,
    public readonly paletteItems: () => PaletteItem[],
    public readonly actions: (item: PaletteItem, elementIds: string[]) => Action[],
    public readonly hideItemsContaining: string[],
    public readonly icon = item.icon!,
    public readonly title = `${item.label} (A)`,
    public readonly location = QuickActionLocation.Right,
    public readonly sorting = item.sortString,
    public readonly action = ShowQuickActionMenuAction.create({
      elementIds: [elementId],
      paletteItems: paletteItems,
      actions: actions,
      hideItemsContaining: hideItemsContaining
    }),
    public readonly readonlySupport = false,
    public readonly letQuickActionsOpen = true
  ) {}
}

class CreateAllElementsQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly paletteItems: () => PaletteItem[],
    public readonly actions: (item: PaletteItem, elementIds: string[]) => Action[],
    public readonly hideItemsContaining: string[],
    public readonly icon = 'fa-regular fa-square',
    public readonly title = 'Create Node',
    public readonly location = QuickActionLocation.Hidden,
    public readonly sorting = 'Z',
    public readonly action = ShowQuickActionMenuAction.create({
      elementIds: [elementId],
      paletteItems: paletteItems,
      actions: actions,
      hideItemsContaining: hideItemsContaining,
      showSearch: true
    }),
    public readonly letQuickActionsOpen = true,
    public readonly readonlySupport = false,
    public readonly shortcut: KeyCode = 'KeyA'
  ) {}
}

export function convertToCreateNodeOperation(action: Action, previousElementId: string): Operation | undefined {
  if (TriggerNodeCreationAction.is(action)) {
    return CreateNodeOperation.create(action.elementTypeId, { args: { previousElementId: previousElementId } });
  }
  if (AttachBoundaryOperation.is(action)) {
    return action;
  }
  return undefined;
}

function boundaryEventGroup(element: SModelElement): PaletteItem | undefined {
  const children: PaletteItem[] = [];
  if (canAddErrorBoundary(element)) {
    children.push({
      id: 'error-boundary',
      label: 'Error Boundary',
      sortString: 'A',
      actions: [AttachBoundaryOperation.create({ elementId: element.id, eventKind: 'error' })],
      icon: 'std:Error'
    });
  }
  if (canAddSignalBoundary(element)) {
    children.push({
      id: 'signal-boundary',
      label: 'Signal Boundary',
      sortString: 'B',
      actions: [AttachBoundaryOperation.create({ elementId: element.id, eventKind: 'signal' })],
      icon: 'std:Signal'
    });
  }
  if (children.length === 0) {
    return undefined;
  }
  return {
    id: 'boundary-group',
    label: 'Boundary Events',
    sortString: 'Z',
    actions: [],
    children: children
  };
}
