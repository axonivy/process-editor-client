import { ContainerModule } from 'inversify';
import { TYPES } from 'sprotty';
import { OpenQuickOutlineKeyListener } from './open-data-class';

const ivyOpenDataClassModule = new ContainerModule((bind, _unbind) => {
  bind(TYPES.KeyListener).to(OpenQuickOutlineKeyListener);
});

export default ivyOpenDataClassModule;
