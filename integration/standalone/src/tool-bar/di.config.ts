import { ContainerModule } from 'inversify';
import { StandaloneToolBar } from './tool-bar';
import { TYPES } from 'sprotty';

const ivyStandaloneToolBarModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(StandaloneToolBar).toSelf().inSingletonScope();
  bind(TYPES.IUIExtension).toService(StandaloneToolBar);
});

export default ivyStandaloneToolBarModule;
