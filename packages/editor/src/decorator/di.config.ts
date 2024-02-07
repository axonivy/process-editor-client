import './decoration.css';

import {
  bindAsService,
  configureModelElement,
  decorationModule,
  DefaultTypes,
  FeatureModule,
  GIssueMarker,
  TYPES
} from '@eclipse-glsp/client';

import { IvyDecorationPlacer } from './decoration-placer';
import { IvyIssueMarkerView } from './issue-marker-view';

const ivyDecorationModule = new FeatureModule(
  (bind, _unbind, isBound) => {
    const context = { bind, isBound };
    // GLSP replacements
    bindAsService(context, TYPES.IVNodePostprocessor, IvyDecorationPlacer);
    configureModelElement(context, DefaultTypes.ISSUE_MARKER, GIssueMarker, IvyIssueMarkerView);
  },
  { featureId: decorationModule.featureId }
);

export default ivyDecorationModule;
