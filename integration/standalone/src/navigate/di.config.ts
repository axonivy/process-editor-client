import { ContainerModule } from 'inversify';
import { configureActionHandler } from 'sprotty';
import { NavigateToExternalTargetActionHandler } from './action-handler';
import { NavigateToExternalTargetAction } from '@eclipse-glsp/protocol';

const ivyNavigateModule = new ContainerModule((bind, _unbind, isBound) => {
  configureActionHandler({ bind, isBound }, NavigateToExternalTargetAction.KIND, NavigateToExternalTargetActionHandler);
});

export default ivyNavigateModule;
