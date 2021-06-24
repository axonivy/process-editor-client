import '../../css/decoration.css';

import { ContainerModule } from 'inversify';
import { TYPES } from 'sprotty';

import { IvyDecorationPlacer } from './decoration-placer';

const ivyDecorationModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(IvyDecorationPlacer).toSelf().inSingletonScope();
  bind(TYPES.IVNodePostprocessor).toService(IvyDecorationPlacer);
});

export default ivyDecorationModule;
