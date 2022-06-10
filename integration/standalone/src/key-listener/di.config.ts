import { ContainerModule } from 'inversify';
import { SelectKeyboardListener, TYPES, UndoRedoKeyListener } from 'sprotty';
import { CopyPasteKeyListener } from './copy-paste';

const ivyStandaloneKeyListenerModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(TYPES.KeyListener).to(UndoRedoKeyListener);
  bind(TYPES.KeyListener).to(SelectKeyboardListener);
  bind(TYPES.KeyListener).to(CopyPasteKeyListener);
});

export default ivyStandaloneKeyListenerModule;
