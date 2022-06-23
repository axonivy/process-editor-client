import '../../css/decoration.css';

import { ContainerModule } from 'inversify';
import { TYPES } from '@eclipse-glsp/client';

import { IvyDecorationPlacer } from './decoration-placer';

const ivyDecorationModule = new ContainerModule(bind => {
  bind(IvyDecorationPlacer).toSelf().inSingletonScope();
  bind(TYPES.IVNodePostprocessor).toService(IvyDecorationPlacer);
});

export default ivyDecorationModule;
