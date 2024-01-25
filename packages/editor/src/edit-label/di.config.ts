import './edit-label.css';

import {
  ApplyLabelEditCommand,
  BalloonLabelValidationDecorator,
  EditLabelAction,
  FeatureModule,
  TYPES,
  configureActionHandler,
  configureCommand,
  labelEditModule,
  labelEditUiModule
} from '@eclipse-glsp/client';
import { IVY_TYPES } from '../types';
import { IvyDirectLabelEditTool } from './edit-label-tool';
import { IvyEditLabelActionHandler, IvyEditLabelUI } from './edit-label-ui';
import { EditLabelActionProvider } from './quick-action';

export const ivyLabelEditModule = new FeatureModule(
  (bind, _unbind, isBound) => {
    bind(TYPES.IEditLabelValidationDecorator).to(BalloonLabelValidationDecorator);
    bind(TYPES.IDefaultTool).to(IvyDirectLabelEditTool);
    configureCommand({ bind, isBound }, ApplyLabelEditCommand);
    bind(IVY_TYPES.QuickActionProvider).to(EditLabelActionProvider);
  },
  { featureId: labelEditModule.featureId }
);

export const ivyLabelEditUiModule = new FeatureModule(
  (bind, _unbind, isBound) => {
    const context = { bind, isBound };
    configureActionHandler(context, EditLabelAction.KIND, IvyEditLabelActionHandler);
    bind(IvyEditLabelUI).toSelf().inSingletonScope();
    bind(TYPES.IUIExtension).toService(IvyEditLabelUI);
  },
  { featureId: labelEditUiModule.featureId }
);
