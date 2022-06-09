import { ContainerModule } from 'inversify';

import { IVY_TYPES } from '../types';
import { AutoBendEdgeQuickActionProvider, StraightenEdgeQuickActionProvider } from './actions';

const ivyConnectorModule = new ContainerModule(bind => {
  bind(IVY_TYPES.QuickActionProvider).to(StraightenEdgeQuickActionProvider);
  bind(IVY_TYPES.QuickActionProvider).to(AutoBendEdgeQuickActionProvider);
});

export default ivyConnectorModule;
