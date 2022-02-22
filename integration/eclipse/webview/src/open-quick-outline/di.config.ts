import { ContainerModule } from 'inversify';
import { TYPES } from 'sprotty';
import { OpenQuickOutlineKeyListener } from './open-quick-outline';

const ivyOpenQuickOutlineModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(TYPES.KeyListener).to(OpenQuickOutlineKeyListener);
});

export default ivyOpenQuickOutlineModule;