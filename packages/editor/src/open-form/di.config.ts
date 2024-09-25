import { FeatureModule, TYPES } from '@eclipse-glsp/client';
import { OpenDataClassKeyListener } from './key-listener';
import { IVY_TYPES } from '../types';
import { OpenFormEditorButtonProvider } from './toolbar-button';

const ivyOpenDataClassModule = new FeatureModule(bind => {
  bind(TYPES.KeyListener).to(OpenDataClassKeyListener);
  bind(IVY_TYPES.ToolBarButtonProvider).to(OpenFormEditorButtonProvider);
});

export default ivyOpenDataClassModule;
