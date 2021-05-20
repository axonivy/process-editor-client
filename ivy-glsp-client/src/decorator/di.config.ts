import '../../css/decoration.css';

import { GlspIssueMarkerView } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { configureModelElement, SIssueMarker, TYPES } from 'sprotty';

import { IvyDecorationPlacer } from './decoration-placer';

const ivyDecorationModule = new ContainerModule((bind, _unbind, isBound) => {
    configureModelElement({ bind, isBound }, 'marker', SIssueMarker, GlspIssueMarkerView);
    bind(IvyDecorationPlacer).toSelf().inSingletonScope();
    bind(TYPES.IVNodePostprocessor).toService(IvyDecorationPlacer);
});

export default ivyDecorationModule;
