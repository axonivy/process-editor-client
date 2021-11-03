import { ContainerModule } from 'inversify';

import { IVY_TYPES } from '../quick-action/quick-action';
import { CreateLaneQuickActionProvider } from './action';

const ivyLaneModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(IVY_TYPES.QuickActionProvider).to(CreateLaneQuickActionProvider);
});

export default ivyLaneModule;
