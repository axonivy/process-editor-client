import { ContainerModule } from 'inversify';

import { IVY_TYPES } from '../quick-action/model';
import { UnWrapQuickActionProvider } from './actions';

const ivyWrapModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(IVY_TYPES.QuickActionProvider).to(UnWrapQuickActionProvider);
});

export default ivyWrapModule;
