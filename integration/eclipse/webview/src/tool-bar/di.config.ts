import { ContainerModule } from 'inversify';
import { IVY_TYPES } from '@ivyteam/process-editor';
import { InscribeProcessButtonProvider, OpenDataClassButtonProvider, OpenInsertConnectorButtonProvider } from './button';

const ivyToolBarModule = new ContainerModule(bind => {
  bind(IVY_TYPES.ToolBarButtonProvider).to(InscribeProcessButtonProvider);
  bind(IVY_TYPES.ToolBarButtonProvider).to(OpenDataClassButtonProvider);
  bind(IVY_TYPES.ToolBarButtonProvider).to(OpenInsertConnectorButtonProvider);
});

export default ivyToolBarModule;
