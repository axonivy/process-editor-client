import { ContainerModule, interfaces } from 'inversify';
import { IVY_TYPES } from '@ivyteam/process-editor';
import { InscribeProcessButtonProvider, OpenDataClassButtonProvider, OpenInsertConnectorButtonProvider } from './button';

const ivyToolBarModule = new ContainerModule((bind, _unbind) => {
  configureToolBarButtonProvider({ bind });
});

export function configureToolBarButtonProvider(context: { bind: interfaces.Bind }): void {
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(InscribeProcessButtonProvider);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(OpenDataClassButtonProvider);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(OpenInsertConnectorButtonProvider);
}

export default ivyToolBarModule;
