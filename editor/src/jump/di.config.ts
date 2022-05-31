import { configureActionHandler } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { IVY_TYPES } from '../types';
import { JumpAction, JumpActionHandler, JumpQuickActionProvider } from './action';

const ivyJumpModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(IVY_TYPES.QuickActionProvider).to(JumpQuickActionProvider);
  configureActionHandler({ bind, isBound }, JumpAction.KIND, JumpActionHandler);
});

export default ivyJumpModule;
