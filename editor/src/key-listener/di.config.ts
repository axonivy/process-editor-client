import { ContainerModule } from 'inversify';
import { TYPES } from '@eclipse-glsp/client';
import { MoveElementKeyListener } from './change-bounds';
import { QuickActionKeyListener } from './quick-actions';
import { ToolBarKeyListener } from './tool-bar';

const ivyKeyListenerModule = new ContainerModule(bind => {
  bind(TYPES.KeyListener).to(MoveElementKeyListener);
  bind(TYPES.KeyListener).to(QuickActionKeyListener);
  bind(TYPES.KeyListener).to(ToolBarKeyListener);
});

export default ivyKeyListenerModule;
