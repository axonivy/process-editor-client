import { ContainerModule } from 'inversify';
import { SelectKeyboardListener, TYPES, UndoRedoKeyListener } from 'sprotty';
import { MoveElementKeyListener } from './change-bounds';
import { CopyPasteKeyListener } from './copy-paste';
import { QuickActionKeyListener } from './quick-actions';
import { ToolBarKeyListener } from './tool-bar';

const ivyKeyListenerModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(TYPES.KeyListener).to(UndoRedoKeyListener);
  bind(TYPES.KeyListener).to(SelectKeyboardListener);
  bind(TYPES.KeyListener).to(CopyPasteKeyListener);
  bind(TYPES.KeyListener).to(MoveElementKeyListener);
  bind(TYPES.KeyListener).to(QuickActionKeyListener);
  bind(TYPES.KeyListener).to(ToolBarKeyListener);
});

export default ivyKeyListenerModule;
