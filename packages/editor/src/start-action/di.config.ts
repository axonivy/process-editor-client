import { ContainerModule } from 'inversify';
import { SearchProcessCallersActionProvider, StarProcessQuickActionProvider } from './actions';
import { IVY_TYPES } from '../types';

const ivyStartActionModule = new ContainerModule(bind => {
  bind(IVY_TYPES.QuickActionProvider).to(StarProcessQuickActionProvider);
  bind(IVY_TYPES.QuickActionProvider).to(SearchProcessCallersActionProvider);
});

export default ivyStartActionModule;
