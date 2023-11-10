import './quick-action.css';

import { configureActionHandler, EnableToolPaletteAction, TYPES } from '@eclipse-glsp/client';
import { ContainerModule, interfaces } from 'inversify';

import { ConnectQuickActionProvider, QuickActionEdgeCreationTool, QuickActionTriggerEdgeCreationAction } from './edge/edge-creation-tool';
import { AutoAlignQuickActionProvider, DeleteQuickActionProvider } from './quick-action';
import { IVY_TYPES } from '../../types';
import { QuickActionUI } from './quick-action-ui';
import {
  CreateActivityQuickActionProvider,
  CreateAllElementsQuickActionProvider,
  CreateEventQuickActionProvider,
  CreateGatewayQuickActionProvider
} from './node/actions';
import { SelectColorQuickActionProvider } from './color/action';
import { ColorPaletteHandler } from './color/action-handler';
import { TypesPaletteHandler } from './types/action-handler';
import { SelectActivityTypeQuickActionProvider } from './types/action';
import { InfoQuickActionProvider } from './info/action';
import { ShowInfoQuickActionMenuAction, ShowQuickActionMenuAction } from './quick-action-menu-ui';
import { RemoveMarqueeAction } from '@eclipse-glsp/client/lib/features/tool-feedback/marquee-tool-feedback';
import { UpdateColorPaletteAction } from '@axonivy/process-editor-protocol';

const ivyQuickActionModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(QuickActionUI).toSelf().inSingletonScope();
  bind(TYPES.IUIExtension).toService(QuickActionUI);
  configureActionHandler({ bind, isBound }, ShowQuickActionMenuAction.KIND, QuickActionUI);
  configureActionHandler({ bind, isBound }, ShowInfoQuickActionMenuAction.KIND, QuickActionUI);
  configureActionHandler({ bind, isBound }, RemoveMarqueeAction.KIND, QuickActionUI);

  configureQuickActionEdgeTool({ bind, isBound });
  configureQuickActionProviders({ bind });
  configureColorQuickActionProviders({ bind, isBound });
  configureTypeQuickActionProviders({ bind, isBound });
});

export function configureQuickActionEdgeTool(context: { bind: interfaces.Bind; isBound: interfaces.IsBound }): void {
  context.bind(QuickActionEdgeCreationTool).toSelf().inSingletonScope();
  context.bind(TYPES.ITool).toService(QuickActionEdgeCreationTool);
  configureActionHandler(context, QuickActionTriggerEdgeCreationAction.KIND, QuickActionEdgeCreationTool);
}

export function configureQuickActionProviders(context: { bind: interfaces.Bind }): void {
  context.bind(IVY_TYPES.QuickActionProvider).to(DeleteQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(InfoQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(ConnectQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(AutoAlignQuickActionProvider);

  context.bind(IVY_TYPES.QuickActionProvider).to(CreateEventQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(CreateGatewayQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(CreateActivityQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(CreateAllElementsQuickActionProvider);
}

export function configureColorQuickActionProviders(context: { bind: interfaces.Bind; isBound: interfaces.IsBound }): void {
  context.bind(ColorPaletteHandler).toSelf().inSingletonScope();
  context.bind(IVY_TYPES.ColorPalette).toService(ColorPaletteHandler);
  configureActionHandler(context, EnableToolPaletteAction.KIND, ColorPaletteHandler);
  configureActionHandler(context, UpdateColorPaletteAction.KIND, ColorPaletteHandler);
  context.bind(IVY_TYPES.QuickActionProvider).to(SelectColorQuickActionProvider);
}

export function configureTypeQuickActionProviders(context: { bind: interfaces.Bind; isBound: interfaces.IsBound }): void {
  context.bind(TypesPaletteHandler).toSelf().inSingletonScope();
  context.bind(IVY_TYPES.ActivityTypesPalette).toService(TypesPaletteHandler);
  configureActionHandler(context, EnableToolPaletteAction.KIND, TypesPaletteHandler);
  context.bind(IVY_TYPES.QuickActionProvider).to(SelectActivityTypeQuickActionProvider);
}

export default ivyQuickActionModule;
