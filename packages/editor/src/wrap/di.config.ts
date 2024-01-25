import { FeatureModule } from '@eclipse-glsp/client';
import { IVY_TYPES } from '../types';
import { UnwrapQuickActionProvider, WrapQuickActionProvider } from './actions';

const ivyWrapModule = new FeatureModule(bind => {
  bind(IVY_TYPES.QuickActionProvider).to(UnwrapQuickActionProvider);
  bind(IVY_TYPES.QuickActionProvider).to(WrapQuickActionProvider);
});

export default ivyWrapModule;
