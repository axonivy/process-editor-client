import { IVY_TYPES } from '@axonivy/process-editor';
import { OpenInsertExtensionButtonProvider } from './toolbar-button';
import { FeatureModule } from '@eclipse-glsp/client';

const ivyExtensionToolBarModule = new FeatureModule(bind => {
  bind(IVY_TYPES.ToolBarButtonProvider).to(OpenInsertExtensionButtonProvider);
});

export default ivyExtensionToolBarModule;
