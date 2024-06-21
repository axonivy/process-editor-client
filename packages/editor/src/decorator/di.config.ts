import { bindAsService, decorationModule, FeatureModule, TYPES } from '@eclipse-glsp/client';

import { IvyDecorationPlacer } from './decoration-placer';

const ivyDecorationModule = new FeatureModule(
  (bind, _unbind, isBound) => {
    const context = { bind, isBound };
    // GLSP replacements
    bindAsService(context, TYPES.IVNodePostprocessor, IvyDecorationPlacer);
  },
  { featureId: decorationModule.featureId }
);

export default ivyDecorationModule;
