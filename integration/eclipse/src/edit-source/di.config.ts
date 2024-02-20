import { IVY_TYPES } from '@ivyteam/process-editor';
import { ContainerModule } from 'inversify';

import { GoToSourceQuickActionProvider } from './quick-action';

const ivyGoToSourceModule = new ContainerModule(bind => {
  bind(IVY_TYPES.QuickActionProvider).to(GoToSourceQuickActionProvider);
});

export default ivyGoToSourceModule;