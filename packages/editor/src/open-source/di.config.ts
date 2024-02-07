import { FeatureModule } from '@eclipse-glsp/client';
import { IVY_TYPES } from '../types';
import { GoToSourceQuickActionProvider } from './quick-action';

const ivyGoToSourceModule = new FeatureModule(bind => {
  bind(IVY_TYPES.QuickActionProvider).to(GoToSourceQuickActionProvider);
});

export default ivyGoToSourceModule;
