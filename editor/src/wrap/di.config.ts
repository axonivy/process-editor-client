import { ContainerModule } from 'inversify';

import { IVY_TYPES } from '../quick-action/quick-action';
import { UnwrapQuickActionProvider, WrapQuickActionProvider } from './actions';

const ivyWrapModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(IVY_TYPES.QuickActionProvider).to(UnwrapQuickActionProvider);
  bind(IVY_TYPES.QuickActionProvider).to(WrapQuickActionProvider);
});

export default ivyWrapModule;
