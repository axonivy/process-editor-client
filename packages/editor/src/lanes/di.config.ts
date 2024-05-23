import { FeatureModule } from '@eclipse-glsp/client';

import { IVY_TYPES } from '../types';
import { CreateLaneQuickActionProvider } from './action';

const ivyLaneModule = new FeatureModule((bind, _unbind, isBound) => {
  bind(IVY_TYPES.QuickActionProvider).to(CreateLaneQuickActionProvider);
});

export default ivyLaneModule;
