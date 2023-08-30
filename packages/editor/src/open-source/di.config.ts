import { ContainerModule } from 'inversify';

import { GoToSourceQuickActionProvider } from './quick-action';
import { IVY_TYPES } from '../types';

const ivyGoToSourceModule = new ContainerModule(bind => {
  bind(IVY_TYPES.QuickActionProvider).to(GoToSourceQuickActionProvider);
});

export default ivyGoToSourceModule;
