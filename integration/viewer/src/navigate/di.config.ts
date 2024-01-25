import { FeatureModule, configureActionHandler, navigationModule } from '@eclipse-glsp/client';
import { NavigateToExternalTargetAction } from '@eclipse-glsp/protocol';
import { NavigateToExternalTargetActionHandler } from './action-handler';

const ivyNavigationModule = new FeatureModule(
  (bind, _unbind, isBound) => {
    configureActionHandler({ bind, isBound }, NavigateToExternalTargetAction.KIND, NavigateToExternalTargetActionHandler);
  },
  { featureId: navigationModule.featureId }
);

export default ivyNavigationModule;
