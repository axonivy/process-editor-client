import { IVY_TYPES } from '@ivyteam/process-editor/lib/quick-action/quick-action';
import { ContainerModule } from 'inversify';
import { SearchProcessCallersActionProvider, StarProcessQuickActionProvider } from './actions';

const ivyEditorActionModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(IVY_TYPES.QuickActionProvider).to(StarProcessQuickActionProvider);
  bind(IVY_TYPES.QuickActionProvider).to(SearchProcessCallersActionProvider);
});

export default ivyEditorActionModule;
