import './menu.css';
import './toggle-switch.css';
import './tool-bar.css';

import {
  bindAsService,
  configureActionHandler,
  EnableDefaultToolsAction,
  EnableToolPaletteAction,
  FeatureModule,
  toolPaletteModule,
  TYPES
} from '@eclipse-glsp/client';
import { interfaces } from 'inversify';
import { IVY_TYPES } from '../../types';

import { CustomIconToggleAction } from '@axonivy/process-editor-protocol';
import { OptionsButtonProvider } from './button';
import { IvyMarqueeMouseTool } from './marquee-mouse-tool';
import { ElementsPaletteHandler } from './node/action-handler';
import {
  ActivitiesButtonProvider,
  AllElementsButtonProvider,
  ArtifactsButtonProvider,
  EventsButtonProvider,
  GatewaysButtonProvider
} from './node/button';
import { ShowToolBarOptionsMenuAction } from './options/action';
import { CustomIconToggleActionHandler } from './options/action-handler';
import { ToolBar, ToolBarFocusMouseListener } from './tool-bar';
import { ShowToolBarMenuAction } from './tool-bar-menu';

const ivyToolBarModule = new FeatureModule(
  (bind, _unbind, isBound) => {
    bindAsService(bind, IVY_TYPES.ToolBar, ToolBar);
    bind(TYPES.IUIExtension).toService(ToolBar);
    configureActionHandler({ bind, isBound }, EnableToolPaletteAction.KIND, ToolBar);
    configureActionHandler({ bind, isBound }, EnableDefaultToolsAction.KIND, ToolBar);
    configureActionHandler({ bind, isBound }, ShowToolBarMenuAction.KIND, ToolBar);
    bind(ToolBarFocusMouseListener).toSelf().inSingletonScope();
    bind(TYPES.MouseListener).toService(ToolBarFocusMouseListener);

    bind(TYPES.ITool).to(IvyMarqueeMouseTool);

    configureToolBarButtons({ bind, isBound });

    bind(CustomIconToggleActionHandler).toSelf().inSingletonScope();
    configureActionHandler({ bind, isBound }, CustomIconToggleAction.KIND, CustomIconToggleActionHandler);
    configureActionHandler({ bind, isBound }, ShowToolBarOptionsMenuAction.KIND, ToolBar);
  },
  { featureId: toolPaletteModule.featureId }
);

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
