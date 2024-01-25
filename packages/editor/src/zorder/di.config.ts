import { FeatureModule, configureCommand, zorderModule } from '@eclipse-glsp/client';

import { IvyBringToFrontCommand } from './zorder';

const ivyZorderModule = new FeatureModule(
  (bind, _unbind, isBound) => {
    configureCommand({ bind, isBound }, IvyBringToFrontCommand);
  },
  { featureId: zorderModule.featureId }
);

export default ivyZorderModule;
