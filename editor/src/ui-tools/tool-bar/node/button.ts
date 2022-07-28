import { Action, PaletteItem } from '@eclipse-glsp/client';
import { ToolBarButton, ToolBarButtonLocation, ToolBarButtonProvider } from '../button';
import { ShowToolBarMenuAction } from '../tool-bar-menu';
import { injectable, inject } from 'inversify';
import { ElementsPaletteHandler } from './action-handler';

@injectable()
export abstract class CreateElementsButtonProvider implements ToolBarButtonProvider {
  @inject(ElementsPaletteHandler) protected paletteHandler: ElementsPaletteHandler;

  button(): ToolBarButton {
    return this.createToolBarButton(this.paletteItems());
  }

  protected actions = (paletteItem: PaletteItem): Action[] => [
    ShowToolBarMenuAction.create({ paletteItems: () => [], actions: (item: PaletteItem) => [] }),
    ...paletteItem.actions
  ];

  protected paletteItems(): () => PaletteItem[] {
    return () => this.paletteHandler.getPaletteItems();
  }

  abstract createToolBarButton(paletteItems: () => PaletteItem[]): ToolBarButton;
}

@injectable()
export class AllElementsButtonProvider extends CreateElementsButtonProvider {
  createToolBarButton(paletteItems: () => PaletteItem[]): ToolBarButton {
    return new AllElementsToolButton(paletteItems, this.actions);
  }
}

export class AllElementsToolButton implements ToolBarButton {
  constructor(
    public readonly paletteItems: () => PaletteItem[],
    public readonly actions: (item: PaletteItem) => Action[],
    public readonly icon = 'fa-solid fa-bars',
    public readonly title = 'All Elements',
    public readonly sorting = 'A',
    public readonly action = () => ShowToolBarMenuAction.create({ paletteItems: paletteItems, actions: actions, showSearch: true }),
    public readonly id = 'btn_all_elements_menu',
    public readonly location = ToolBarButtonLocation.Middle,
    public readonly switchFocus = true,
    public readonly showTitle = true
  ) {}
}

@injectable()
export class EventsButtonProvider extends CreateElementsButtonProvider {
  paletteItems(): () => PaletteItem[] {
    return () => this.paletteHandler.getPaletteItems().filter(item => item.id.match(/event-[a-z]+-group/));
  }

  createToolBarButton(paletteItems: () => PaletteItem[]): ToolBarButton {
    return new EventsToolButton(paletteItems, this.actions);
  }
}

export class EventsToolButton implements ToolBarButton {
  constructor(
    public readonly paletteItems: () => PaletteItem[],
    public readonly actions: (item: PaletteItem) => Action[],
    public readonly icon = 'fa-regular fa-circle',
    public readonly title = 'Events',
    public readonly sorting = 'B',
    public readonly action = () =>
      ShowToolBarMenuAction.create({
        paletteItems: paletteItems,
        actions: actions
      }),
    public readonly id = 'btn_events_menu',
    public readonly location = ToolBarButtonLocation.Middle,
    public readonly switchFocus = true,
    public readonly showTitle = true
  ) {}
}

@injectable()
export class GatewaysButtonProvider extends CreateElementsButtonProvider {
  paletteItems(): () => PaletteItem[] {
    return () => this.paletteHandler.getPaletteItems().filter(item => item.id === 'gateway-group');
  }

  createToolBarButton(paletteItems: () => PaletteItem[]): ToolBarButton {
    return new GatewaysToolButton(paletteItems, this.actions);
  }
}

export class GatewaysToolButton implements ToolBarButton {
  constructor(
    public readonly paletteItems: () => PaletteItem[],
    public readonly actions: (item: PaletteItem) => Action[],
    public readonly icon = 'fa-regular fa-square fa-rotate-45',
    public readonly title = 'Gateways',
    public readonly sorting = 'C',
    public readonly action = () =>
      ShowToolBarMenuAction.create({
        paletteItems: paletteItems,
        actions: actions
      }),
    public readonly id = 'btn_gateways_menu',
    public readonly location = ToolBarButtonLocation.Middle,
    public readonly switchFocus = true,
    public readonly showTitle = true
  ) {}
}

@injectable()
export class ActivitiesButtonProvider extends CreateElementsButtonProvider {
  paletteItems(): () => PaletteItem[] {
    return () => this.paletteHandler.getPaletteItems().filter(item => item.id === 'activity-group' || item.id === 'bpmn-activity-group');
  }

  createToolBarButton(paletteItems: () => PaletteItem[]): ToolBarButton {
    return new ActivitiesToolButton(paletteItems, this.actions);
  }
}

export class ActivitiesToolButton implements ToolBarButton {
  constructor(
    public readonly paletteItems: () => PaletteItem[],
    public readonly actions: (item: PaletteItem) => Action[],
    public readonly icon = 'fa-regular fa-square',
    public readonly title = 'Activities',
    public readonly sorting = 'D',
    public readonly action = () =>
      ShowToolBarMenuAction.create({
        paletteItems: paletteItems,
        actions: actions
      }),
    public readonly id = 'btn_activities_menu',
    public readonly location = ToolBarButtonLocation.Middle,
    public readonly switchFocus = true,
    public readonly showTitle = true
  ) {}
}

@injectable()
export class ArtifactsButtonProvider extends CreateElementsButtonProvider {
  paletteItems(): () => PaletteItem[] {
    return () => this.paletteHandler.getPaletteItems().filter(item => item.id === 'swimlane-group' || item.id === 'annotation-group');
  }

  createToolBarButton(paletteItems: () => PaletteItem[]): ToolBarButton {
    return new ArtifactsToolButton(paletteItems, this.actions);
  }
}

export class ArtifactsToolButton implements ToolBarButton {
  constructor(
    public readonly paletteItems: () => PaletteItem[],
    public readonly actions: (item: PaletteItem) => Action[],
    public readonly icon = 'fa-solid fa-columns fa-rotate-270',
    public readonly title = 'Artifacts',
    public readonly sorting = 'E',
    public readonly action = () =>
      ShowToolBarMenuAction.create({
        paletteItems: paletteItems,
        actions: actions
      }),
    public readonly id = 'btn_artifacts_menu',
    public readonly location = ToolBarButtonLocation.Middle,
    public readonly switchFocus = true,
    public readonly showTitle = true
  ) {}
}
