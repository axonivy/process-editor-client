import { ContainerModule } from 'inversify';
import { SelectKeyboardListener, TYPES, UndoRedoKeyListener } from 'sprotty';
import { ChangeBoundsKeyListener } from './change-bounds';
import { CopyPasteKeyListener } from './copy-paste';

const ivyKeyListenerModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(TYPES.KeyListener).to(UndoRedoKeyListener);
  bind(TYPES.KeyListener).to(SelectKeyboardListener);
  bind(TYPES.KeyListener).to(CopyPasteKeyListener);
  bind(TYPES.KeyListener).to(ChangeBoundsKeyListener);
});

export default ivyKeyListenerModule;
