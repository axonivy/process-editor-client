import { FeatureModule } from '@eclipse-glsp/client';
import { IVY_TYPES } from '../types';
import { AutoBendEdgeQuickActionProvider, ReconnectEdgeQuickActionProvider, StraightenEdgeQuickActionProvider } from './actions';

const ivyConnectorModule = new FeatureModule(bind => {
  bind(IVY_TYPES.QuickActionProvider).to(StraightenEdgeQuickActionProvider);
  bind(IVY_TYPES.QuickActionProvider).to(AutoBendEdgeQuickActionProvider);
  bind(IVY_TYPES.QuickActionProvider).to(ReconnectEdgeQuickActionProvider);
});

export default ivyConnectorModule;
