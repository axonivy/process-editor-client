import { ContainerModule } from 'inversify';

import { IVY_TYPES } from '../quick-action/quick-action';
import { AutoBendEdgeQuickActionProvider, StraightenEdgeQuickActionProvider } from './actions';

const ivyConnectorModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(IVY_TYPES.QuickActionProvider).to(StraightenEdgeQuickActionProvider);
  bind(IVY_TYPES.QuickActionProvider).to(AutoBendEdgeQuickActionProvider);
});

export default ivyConnectorModule;
