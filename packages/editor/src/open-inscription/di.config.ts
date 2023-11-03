import { ContainerModule } from 'inversify';
import { InscribeQuickActionProvider } from './quick-action';
import { IVY_TYPES } from '../types';

const ivyOpenInscriptionModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(IVY_TYPES.QuickActionProvider).to(InscribeQuickActionProvider);
});

export default ivyOpenInscriptionModule;
