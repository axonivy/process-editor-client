import '../../css/inline-label.css';

import {
  BalloonLabelValidationDecorator,
  TYPES,
  ApplyLabelEditCommand,
  configureCommand,
  EditLabelAction,
  configureActionHandler
} from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { IvyDirectLabelEditTool } from './edit-label-tool';
import { IVY_TYPES } from '../types';
import { EditLabelActionProvider } from './quick-action';
import { IvyEditLabelActionHandler, IvyEditLabelUI } from './edit-label-ui';

export const ivyEditLabelModule = new ContainerModule((bind, _unbind, isBound, _rebind) => {
  bind(TYPES.IEditLabelValidationDecorator).to(BalloonLabelValidationDecorator);
  bind(TYPES.IDefaultTool).to(IvyDirectLabelEditTool);
  configureCommand({ bind, isBound }, ApplyLabelEditCommand);
  bind(IVY_TYPES.QuickActionProvider).to(EditLabelActionProvider);
});

export const ivyEditLabelUiModule = new ContainerModule((bind, _unbind, isBound) => {
  const context = { bind, isBound };
  configureActionHandler(context, EditLabelAction.KIND, IvyEditLabelActionHandler);
  bind(IvyEditLabelUI).toSelf().inSingletonScope();
  bind(TYPES.IUIExtension).toService(IvyEditLabelUI);
});
