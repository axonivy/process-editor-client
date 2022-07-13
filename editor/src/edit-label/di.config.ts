import '../../css/inline-label.css';

import {
  BalloonLabelValidationDecorator,
  ServerEditLabelValidator,
  TYPES,
  ApplyLabelEditCommand,
  configureCommand
} from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { IvyDirectLabelEditTool } from './edit-label-tool';
import { IVY_TYPES } from '../types';
import { EditLabelActionProvider } from './quick-action';

const ivyEditLabelModule = new ContainerModule((bind, _unbind, isBound, _rebind) => {
  bind(TYPES.IEditLabelValidator).to(ServerEditLabelValidator);
  bind(TYPES.IEditLabelValidationDecorator).to(BalloonLabelValidationDecorator);
  bind(TYPES.IDefaultTool).to(IvyDirectLabelEditTool);
  configureCommand({ bind, isBound }, ApplyLabelEditCommand);
  bind(IVY_TYPES.QuickActionProvider).to(EditLabelActionProvider);
});

export default ivyEditLabelModule;
