import { ContainerModule } from 'inversify';

import { IVY_TYPES } from '../quick-action/model';
import { AttachErrorBoundaryQuickActionProvider, AttachSignalBoundaryQuickActionProvider } from './actions';

const ivyBoundaryModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(IVY_TYPES.QuickActionProvider).to(AttachErrorBoundaryQuickActionProvider);
  bind(IVY_TYPES.QuickActionProvider).to(AttachSignalBoundaryQuickActionProvider);
});

export default ivyBoundaryModule;
