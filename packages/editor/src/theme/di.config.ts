import { ContainerModule } from 'inversify';
import { configureActionHandler } from '@eclipse-glsp/client';
import { SwitchThemeActionHandler } from './action-handler';
import { SwitchThemeAction } from '@axonivy/process-editor-protocol';

const ivyThemeModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(SwitchThemeActionHandler).toSelf().inSingletonScope();
  configureActionHandler({ bind, isBound }, SwitchThemeAction.KIND, SwitchThemeActionHandler);
});

export default ivyThemeModule;
