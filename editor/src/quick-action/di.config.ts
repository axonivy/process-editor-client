import '../../css/quick-action.css';

import { configureActionHandler, GLSP_TYPES, TYPES } from '@eclipse-glsp/client';
import { ContainerModule, interfaces } from 'inversify';

import { ConnectQuickActionProvider, QuickActionEdgeCreationTool, QuickActionTriggerEdgeCreationAction } from './edge/edge-creation-tool';
import { AutoAlignQuickActionProvider, DeleteQuickActionProvider, EditLabelActionProvider, IVY_TYPES } from './quick-action';
import { QuickActionUI } from './quick-action-ui';

const ivyQuickActionModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(QuickActionUI).toSelf().inSingletonScope();
  bind(TYPES.IUIExtension).toService(QuickActionUI);

  configureQuickActionEdgeTool({ bind, isBound });
  configureQuickActionProviders({ bind });
});

export function configureQuickActionEdgeTool(context: { bind: interfaces.Bind; isBound: interfaces.IsBound }): void {
  context.bind(QuickActionEdgeCreationTool).toSelf().inSingletonScope();
  context.bind(GLSP_TYPES.ITool).toService(QuickActionEdgeCreationTool);
  configureActionHandler(context, QuickActionTriggerEdgeCreationAction.KIND, QuickActionEdgeCreationTool);
}

export function configureQuickActionProviders(context: { bind: interfaces.Bind }): void {
  context.bind(IVY_TYPES.QuickActionProvider).to(DeleteQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(ConnectQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(AutoAlignQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(EditLabelActionProvider);
}

export default ivyQuickActionModule;
