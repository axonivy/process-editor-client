import { IVY_TYPES } from '@axonivy/process-editor';
import { FeatureModule } from '@eclipse-glsp/protocol';
import { OpenDataClassButtonProvider, OpenInsertExtensionButtonProvider } from './button';

const ivyToolBarModule = new FeatureModule(bind => {
  bind(IVY_TYPES.ToolBarButtonProvider).to(OpenDataClassButtonProvider);
  bind(IVY_TYPES.ToolBarButtonProvider).to(OpenInsertExtensionButtonProvider);
});

export default ivyToolBarModule;
