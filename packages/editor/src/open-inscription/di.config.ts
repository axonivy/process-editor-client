import { FeatureModule } from '@eclipse-glsp/client';
import { IVY_TYPES } from '../types';
import { InscribeQuickActionProvider } from './quick-action';

const ivyOpenInscriptionModule = new FeatureModule(bind => {
  bind(IVY_TYPES.QuickActionProvider).to(InscribeQuickActionProvider);
});

export default ivyOpenInscriptionModule;
