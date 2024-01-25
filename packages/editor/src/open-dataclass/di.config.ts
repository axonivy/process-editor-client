import { FeatureModule, TYPES } from '@eclipse-glsp/client';
import { OpenQuickOutlineKeyListener } from './open-dataclass';

const ivyOpenDataClassModule = new FeatureModule(bind => {
  bind(TYPES.KeyListener).to(OpenQuickOutlineKeyListener);
});

export default ivyOpenDataClassModule;
