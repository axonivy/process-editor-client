import { ContainerModule } from 'inversify';
import { configureActionHandler } from '@eclipse-glsp/client';
import { SetDirtyStateAction, SetDirtyStateActionHandler } from './action-handler';

const ivyDirtyStateModule = new ContainerModule((bind, _unbind, isBound) => {
  configureActionHandler({ bind, isBound }, SetDirtyStateAction.KIND, SetDirtyStateActionHandler);
});

export default ivyDirtyStateModule;
