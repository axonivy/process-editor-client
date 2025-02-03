import { FeatureModule, TYPES } from '@eclipse-glsp/client';
import { JumpOutKeyListener } from './jump-out';
import { QuickActionKeyListener } from './quick-actions';

const ivyKeyListenerModule = new FeatureModule(bind => {
  bind(TYPES.KeyListener).to(QuickActionKeyListener);
  bind(TYPES.KeyListener).to(JumpOutKeyListener);
});

export default ivyKeyListenerModule;
