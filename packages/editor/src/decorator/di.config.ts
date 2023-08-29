import '../../css/decoration.css';

import { ContainerModule } from 'inversify';
import { configureModelElement, DefaultTypes, SIssueMarker, TYPES } from '@eclipse-glsp/client';

import { IvyDecorationPlacer } from './decoration-placer';
import { IvyIssueMarkerView } from './issue-marker-view';

const ivyDecorationModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(IvyDecorationPlacer).toSelf().inSingletonScope();
  bind(TYPES.IVNodePostprocessor).toService(IvyDecorationPlacer);
  configureModelElement({ bind: bind, isBound: isBound }, DefaultTypes.ISSUE_MARKER, SIssueMarker, IvyIssueMarkerView);
});

export default ivyDecorationModule;
