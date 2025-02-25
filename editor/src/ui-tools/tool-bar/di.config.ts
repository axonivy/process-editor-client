import '../../../css/tool-bar.css';
import '../../../css/toggle-switch.css';
import '../../../css/menu.css';

import { configureActionHandler, EnableDefaultToolsAction, EnableToolPaletteAction, TYPES } from '@eclipse-glsp/client';
import { ContainerModule, type interfaces } from 'inversify';
import { IVY_TYPES } from '../../types';

import { ToolBar } from './tool-bar';
import { IvyMarqueeMouseTool } from './marquee-mouse-tool';
import { OptionsButtonProvider } from './button';
import { CustomIconToggleActionHandler } from './options/action-handler';
import { CustomIconToggleAction, ShowToolBarOptionsMenuAction } from './options/action';
import { ElementsPaletteHandler } from './node/action-handler';
import {
  ActivitiesButtonProvider,
  AllElementsButtonProvider,
  EventsButtonProvider,
  GatewaysButtonProvider,
  ArtifactsButtonProvider
} from './node/button';
import { ShowToolBarMenuAction } from './tool-bar-menu';

const ivyToolBarModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(ToolBar).toSelf().inSingletonScope();
  bind(TYPES.IUIExtension).toService(ToolBar);
  bind(IVY_TYPES.ToolBar).toService(ToolBar);
  configureActionHandler({ bind, isBound }, EnableToolPaletteAction.KIND, ToolBar);
  configureActionHandler({ bind, isBound }, EnableDefaultToolsAction.KIND, ToolBar);
  configureActionHandler({ bind, isBound }, ShowToolBarMenuAction.KIND, ToolBar);
  bind(TYPES.ITool).to(IvyMarqueeMouseTool);

  configureToolBarButtons({ bind, isBound });

  bind(CustomIconToggleActionHandler).toSelf().inSingletonScope();
  configureActionHandler({ bind, isBound }, CustomIconToggleAction.KIND, CustomIconToggleActionHandler);
  configureActionHandler({ bind, isBound }, ShowToolBarOptionsMenuAction.KIND, ToolBar);
});

function configureToolBarButtons(context: { bind: interfaces.Bind; isBound: interfaces.IsBound }): void {
  context.bind(ElementsPaletteHandler).toSelf().inSingletonScope();
  configureActionHandler(context, EnableToolPaletteAction.KIND, ElementsPaletteHandler);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(AllElementsButtonProvider);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(EventsButtonProvider);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(GatewaysButtonProvider);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(ActivitiesButtonProvider);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(ArtifactsButtonProvider);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(OptionsButtonProvider);
}

export default ivyToolBarModule;
