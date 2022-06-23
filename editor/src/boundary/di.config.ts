import { ContainerModule } from 'inversify';

import { IVY_TYPES } from '../types';
import { AttachErrorBoundaryQuickActionProvider, AttachSignalBoundaryQuickActionProvider } from './actions';

const ivyBoundaryModule = new ContainerModule(bind => {
  bind(IVY_TYPES.QuickActionProvider).to(AttachErrorBoundaryQuickActionProvider);
  bind(IVY_TYPES.QuickActionProvider).to(AttachSignalBoundaryQuickActionProvider);
});

export default ivyBoundaryModule;
