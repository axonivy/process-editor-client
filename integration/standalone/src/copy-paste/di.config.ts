import { FeatureModule, InvokeCopyPasteAction, TYPES, configureActionHandler } from '@eclipse-glsp/client';
import { CopyPasteKeyListener } from './copy-paste';
import { InvokeCopyPasteActionHandler } from './copy-paste-handler';

const ivyStandaloneCopyPasteModule = new FeatureModule((bind, _unbind, isBound) => {
  bind(TYPES.KeyListener).to(CopyPasteKeyListener);
  configureActionHandler({ bind, isBound }, InvokeCopyPasteAction.KIND, InvokeCopyPasteActionHandler);
});

export default ivyStandaloneCopyPasteModule;
