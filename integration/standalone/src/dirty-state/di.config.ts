import { FeatureModule, configureActionHandler } from '@eclipse-glsp/client';
import { SetDirtyStateAction, SetDirtyStateActionHandler } from './action-handler';

const ivyDirtyStateModule = new FeatureModule((bind, _unbind, isBound) => {
  configureActionHandler({ bind, isBound }, SetDirtyStateAction.KIND, SetDirtyStateActionHandler);
});

export default ivyDirtyStateModule;
