import { ContainerModule } from 'inversify';
import { TYPES } from '@eclipse-glsp/client';
import { OpenQuickOutlineKeyListener } from './open-quick-outline';

const ivyOpenQuickOutlineModule = new ContainerModule(bind => {
  bind(TYPES.KeyListener).to(OpenQuickOutlineKeyListener);
});

export default ivyOpenQuickOutlineModule;
