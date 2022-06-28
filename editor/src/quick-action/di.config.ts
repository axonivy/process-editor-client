import '../../css/quick-action.css';

import { configureActionHandler, TYPES } from '@eclipse-glsp/client';
import { ContainerModule, interfaces } from 'inversify';

import { ConnectQuickActionProvider, QuickActionEdgeCreationTool, QuickActionTriggerEdgeCreationAction } from './edge/edge-creation-tool';
import { AutoAlignQuickActionProvider, DeleteQuickActionProvider, EditLabelActionProvider } from './quick-action';
import { IVY_TYPES } from '../types';
import { QuickActionUI } from './quick-action-ui';
import { CreateNodeUi } from './node/create-node-ui';
import { AttachCommentProvider, CreateElementQuickActionProvider } from './node/actions';

const ivyQuickActionModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(QuickActionUI).toSelf().inSingletonScope();
  bind(TYPES.IUIExtension).toService(QuickActionUI);

  configureQuickActionEdgeTool({ bind, isBound });
  configureQuickActionProviders({ bind });
  configureNodeCreationTool({ bind });
});

export function configureQuickActionEdgeTool(context: { bind: interfaces.Bind; isBound: interfaces.IsBound }): void {
  context.bind(QuickActionEdgeCreationTool).toSelf().inSingletonScope();
  context.bind(TYPES.ITool).toService(QuickActionEdgeCreationTool);
  configureActionHandler(context, QuickActionTriggerEdgeCreationAction.KIND, QuickActionEdgeCreationTool);
}

export function configureQuickActionProviders(context: { bind: interfaces.Bind }): void {
  context.bind(IVY_TYPES.QuickActionProvider).to(DeleteQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(ConnectQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(AutoAlignQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(EditLabelActionProvider);
}

export function configureNodeCreationTool(context: { bind: interfaces.Bind }): void {
  context.bind(CreateNodeUi).toSelf().inSingletonScope();
  context.bind(TYPES.IUIExtension).toService(CreateNodeUi);
  context.bind(IVY_TYPES.QuickActionProvider).to(AttachCommentProvider);
  context.bind(IVY_TYPES.CategoryQuickActionProvider).to(CreateElementQuickActionProvider);
}

export default ivyQuickActionModule;
