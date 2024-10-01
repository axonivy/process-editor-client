import { FeatureModule, TYPES } from '@eclipse-glsp/client';
import { OpenDataClassKeyListener } from './key-listener';
import { IVY_TYPES } from '../types';
import { OpenFormEditorButtonProvider } from './toolbar-button';
import { OpenFormQuickActionProvider } from './quick-action';

const ivyOpenFormModule = new FeatureModule(bind => {
  bind(TYPES.KeyListener).to(OpenDataClassKeyListener);
  bind(IVY_TYPES.ToolBarButtonProvider).to(OpenFormEditorButtonProvider);
  bind(IVY_TYPES.QuickActionProvider).to(OpenFormQuickActionProvider);
});

export default ivyOpenFormModule;
