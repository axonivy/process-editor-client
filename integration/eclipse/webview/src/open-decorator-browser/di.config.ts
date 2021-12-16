import { IVY_TYPES } from '@ivyteam/process-editor/lib/quick-action/quick-action';
import { ContainerModule } from 'inversify';
import { CustomIconQuickActionProvider } from './quick-action';

const ivyOpenDecoratorBrowserModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(IVY_TYPES.QuickActionProvider).to(CustomIconQuickActionProvider);
});

export default ivyOpenDecoratorBrowserModule;
