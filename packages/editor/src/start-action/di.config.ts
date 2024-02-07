import { FeatureModule } from '@eclipse-glsp/client';
import { IVY_TYPES } from '../types';
import { SearchProcessCallersActionProvider, StarProcessQuickActionProvider } from './actions';

const ivyStartActionModule = new FeatureModule(bind => {
  bind(IVY_TYPES.QuickActionProvider).to(StarProcessQuickActionProvider);
  bind(IVY_TYPES.QuickActionProvider).to(SearchProcessCallersActionProvider);
});

export default ivyStartActionModule;
