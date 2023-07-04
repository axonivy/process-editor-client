import { ContainerModule } from 'inversify';
import { TYPES } from '@eclipse-glsp/client';
import { OpenQuickOutlineKeyListener } from './open-data-class';

const ivyOpenDataClassModule = new ContainerModule(bind => {
  bind(TYPES.KeyListener).to(OpenQuickOutlineKeyListener);
});

export default ivyOpenDataClassModule;
