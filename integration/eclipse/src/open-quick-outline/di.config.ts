import { FeatureModule, TYPES } from '@eclipse-glsp/client';
import { OpenQuickOutlineKeyListener } from './open-quick-outline';

const ivyOpenQuickOutlineModule = new FeatureModule(bind => {
  bind(TYPES.KeyListener).to(OpenQuickOutlineKeyListener);
});

export default ivyOpenQuickOutlineModule;
