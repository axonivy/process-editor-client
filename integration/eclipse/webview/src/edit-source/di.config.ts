import { IVY_TYPES } from '@ivyteam/process-editor';
import { ContainerModule } from 'inversify';

import { EditSourceQuickActionProvider } from './quick-action';

const ivyEditSourceModule = new ContainerModule(bind => {
  bind(IVY_TYPES.QuickActionProvider).to(EditSourceQuickActionProvider);
});

export default ivyEditSourceModule;
