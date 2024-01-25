import { SwitchThemeAction } from '@axonivy/process-editor-protocol';
import { FeatureModule, configureActionHandler } from '@eclipse-glsp/client';
import { SwitchThemeActionHandler } from './action-handler';

const ivyThemeModule = new FeatureModule((bind, _unbind, isBound) => {
  bind(SwitchThemeActionHandler).toSelf().inSingletonScope();
  configureActionHandler({ bind, isBound }, SwitchThemeAction.KIND, SwitchThemeActionHandler);
});

export default ivyThemeModule;
