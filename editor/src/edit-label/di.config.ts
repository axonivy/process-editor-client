import '../../css/inline-label.css';

import { BalloonLabelValidationDecorator, GLSP_TYPES, ServerEditLabelValidator, TYPES } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { ApplyLabelEditCommand, configureCommand } from 'sprotty';
import { IvyDirectLabelEditTool } from './edit-label-tool';

const ivyEditLabelModule = new ContainerModule((bind, _unbind, isBound, _rebind) => {
  bind(TYPES.IEditLabelValidator).to(ServerEditLabelValidator);
  bind(TYPES.IEditLabelValidationDecorator).to(BalloonLabelValidationDecorator);
  bind(GLSP_TYPES.IDefaultTool).to(IvyDirectLabelEditTool);
  configureCommand({ bind, isBound }, ApplyLabelEditCommand);
});

export default ivyEditLabelModule;
