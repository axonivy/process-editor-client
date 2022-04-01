import { ContainerModule } from 'inversify';

import { IVY_TYPES } from '../types';
import { JumpQuickActionProvider } from './action';

const ivyJumpModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(IVY_TYPES.QuickActionProvider).to(JumpQuickActionProvider);
});

export default ivyJumpModule;
