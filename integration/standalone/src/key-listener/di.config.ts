import { ContainerModule } from 'inversify';
import { SelectKeyboardListener, TYPES, UndoRedoKeyListener, configureActionHandler } from '@eclipse-glsp/client';
import { InvokeCopyPasteAction } from '@eclipse-glsp/client/lib/features/copy-paste/copy-paste-context-menu';
import { CopyPasteKeyListener } from './copy-paste';
import { InvokeCopyPasteActionHandler } from './copy-paste-handler';

const ivyStandaloneKeyListenerModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(TYPES.KeyListener).to(UndoRedoKeyListener);
  bind(TYPES.KeyListener).to(SelectKeyboardListener);
  bind(TYPES.KeyListener).to(CopyPasteKeyListener);
  configureActionHandler({ bind, isBound }, InvokeCopyPasteAction.KIND, InvokeCopyPasteActionHandler);
});

export default ivyStandaloneKeyListenerModule;
