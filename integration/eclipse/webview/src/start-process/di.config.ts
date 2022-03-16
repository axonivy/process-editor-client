import { IVY_TYPES } from '@ivyteam/process-editor/lib/quick-action/quick-action';
import { ContainerModule } from 'inversify';
import { StarProcessQuickActionProvider } from './action';

const ivyStartProcessModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(IVY_TYPES.QuickActionProvider).to(StarProcessQuickActionProvider);
});

export default ivyStartProcessModule;
