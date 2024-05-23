import { IVY_TYPES } from '@axonivy/process-editor';
import { OpenDataClassButtonProvider, OpenInsertExtensionButtonProvider } from './button';
import { FeatureModule } from '@eclipse-glsp/client';

const ivyToolBarModule = new FeatureModule(bind => {
  bind(IVY_TYPES.ToolBarButtonProvider).to(OpenDataClassButtonProvider);
  bind(IVY_TYPES.ToolBarButtonProvider).to(OpenInsertExtensionButtonProvider);
});

export default ivyToolBarModule;
