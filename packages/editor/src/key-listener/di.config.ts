import { FeatureModule, TYPES } from '@eclipse-glsp/client';
import { MoveElementKeyListener } from './move';
import { JumpOutKeyListener } from './jump-out';
import { QuickActionKeyListener } from './quick-actions';

const ivyKeyListenerModule = new FeatureModule(bind => {
  bind(TYPES.KeyListener).to(MoveElementKeyListener);
  bind(TYPES.KeyListener).to(QuickActionKeyListener);
  bind(TYPES.KeyListener).to(JumpOutKeyListener);
});

export default ivyKeyListenerModule;
