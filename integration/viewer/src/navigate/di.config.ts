import { ContainerModule } from 'inversify';
import { NavigateToExternalTargetActionHandler } from './action-handler';
import { NavigateToExternalTargetAction } from '@eclipse-glsp/protocol';
import { configureActionHandler } from '@eclipse-glsp/client';

const ivyNavigationModule = new ContainerModule((bind, _unbind, isBound) => {
  configureActionHandler({ bind, isBound }, NavigateToExternalTargetAction.KIND, NavigateToExternalTargetActionHandler);
});

export default ivyNavigationModule;
