import { JumpOutKeyListener, QuickActionKeyListener } from '@axonivy/process-editor';
import { FeatureModule, TYPES } from '@eclipse-glsp/client';

const ivyViewerKeyListenerModule = new FeatureModule(bind => {
  bind(TYPES.KeyListener).to(QuickActionKeyListener);
  bind(TYPES.KeyListener).to(JumpOutKeyListener);
});

export default ivyViewerKeyListenerModule;
