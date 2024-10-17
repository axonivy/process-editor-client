import { Action, PaletteItem } from '@eclipse-glsp/client';
import { ToolBarButton, ToolBarButtonLocation, ToolBarButtonProvider } from '../button';
import { ShowToolBarMenuAction } from '../tool-bar-menu';
import { injectable, inject } from 'inversify';
import { ElementsPaletteHandler } from './action-handler';
import { IvyIcons } from '@axonivy/ui-icons';

@injectable()
export abstract class CreateElementsButtonProvider implements ToolBarButtonProvider {
  @inject(ElementsPaletteHandler) protected paletteHandler: ElementsPaletteHandler;

  button() {
    return this.createToolBarButton(this.paletteItems());
  }

  protected actions = (paletteItem: PaletteItem): Action[] => [
    ShowToolBarMenuAction.create({ id: '', paletteItems: () => [], actions: (item: PaletteItem) => [] }),
    ...paletteItem.actions
  ];

  protected paletteItems(): () => PaletteItem[] {
    return () => this.paletteHandler.getPaletteItems();
  }

  abstract createToolBarButton(paletteItems: () => PaletteItem[]): ToolBarButton;
}

@injectable()
export class AllElementsButtonProvider extends CreateElementsButtonProvider {
  createToolBarButton(paletteItems: () => PaletteItem[]) {
    const id = 'all_elements_menu';
    return {
      icon: IvyIcons.Task,
      title: 'All Elements',
      sorting: 'A',
      action: () => ShowToolBarMenuAction.create({ id, paletteItems, actions: this.actions, showSearch: true }),
      id: `btn_${id}`,
      location: ToolBarButtonLocation.Middle,
      switchFocus: true,
      showTitle: true
    };
  }
}

@injectable()
export class EventsButtonProvider extends CreateElementsButtonProvider {
  paletteItems(): () => PaletteItem[] {
    return () => this.paletteHandler.getPaletteItems().filter(item => item.id.match(/event-[a-z]+-group/));
  }

  createToolBarButton(paletteItems: () => PaletteItem[]) {
    const id = 'events_menu';
    return {
      icon: IvyIcons.Start,
      title: 'Events',
      sorting: 'B',
      action: () => ShowToolBarMenuAction.create({ id, paletteItems, actions: this.actions }),
      id: `btn_${id}`,
      location: ToolBarButtonLocation.Middle,
      switchFocus: true,
      showTitle: true
    };
  }
}

@injectable()
export class GatewaysButtonProvider extends CreateElementsButtonProvider {
  paletteItems(): () => PaletteItem[] {
    return () => this.paletteHandler.getPaletteItems().filter(item => item.id === 'gateway-group');
  }

  createToolBarButton(paletteItems: () => PaletteItem[]) {
    const id = 'gateways_menu';
    return {
      icon: IvyIcons.GatewaysGroup,
      title: 'Gateways',
      sorting: 'C',
      action: () => ShowToolBarMenuAction.create({ id, paletteItems, actions: this.actions }),
      id: `btn_${id}`,
      location: ToolBarButtonLocation.Middle,
      switchFocus: true,
      showTitle: true
    };
  }
}

@injectable()
export class ActivitiesButtonProvider extends CreateElementsButtonProvider {
  paletteItems(): () => PaletteItem[] {
    return () =>
      this.paletteHandler
        .getPaletteItems()
        .filter(item => item.id === 'activity-group' || item.id === 'interface-activity-group' || item.id === 'bpmn-activity-group');
  }

  createToolBarButton(paletteItems: () => PaletteItem[]) {
    const id = 'activities_menu';
    return {
      icon: IvyIcons.ActivitiesGroup,
      title: 'Activities',
      sorting: 'D',
      action: () => ShowToolBarMenuAction.create({ id, paletteItems, actions: this.actions }),
      id: `btn_${id}`,
      location: ToolBarButtonLocation.Middle,
      switchFocus: true,
      showTitle: true
    };
  }
}

@injectable()
export class ArtifactsButtonProvider extends CreateElementsButtonProvider {
  paletteItems(): () => PaletteItem[] {
    return () => this.paletteHandler.getPaletteItems().filter(item => item.id === 'swimlane-group' || item.id === 'annotation-group');
  }

  createToolBarButton(paletteItems: () => PaletteItem[]) {
    const id = 'artifacts_menu';
    return {
      icon: IvyIcons.PoolSwimlanes,
      title: 'Artifacts',
      sorting: 'E',
      action: () => ShowToolBarMenuAction.create({ id, paletteItems, actions: this.actions }),
      id: `btn_${id}`,
      location: ToolBarButtonLocation.Middle,
      switchFocus: true,
      showTitle: true
    };
  }
}

@injectable()
export class ExtensionButtonProvider extends CreateElementsButtonProvider {
  createToolBarButton(paletteItems: () => PaletteItem[]) {
    const id = 'extensions_menu';
    return {
      icon: IvyIcons.Extension,
      title: 'Extensions',
      sorting: 'F',
      action: () =>
        ShowToolBarMenuAction.create({
          id,
          paletteItems: () => this.paletteHandler.getExtensionItems(),
          actions: this.actions,
          showSearch: true,
          customCssClass: 'menu-as-list'
        }),
      id: `btn_${id}`,
      location: ToolBarButtonLocation.Middle,
      switchFocus: true,
      showTitle: true
    };
  }
}
