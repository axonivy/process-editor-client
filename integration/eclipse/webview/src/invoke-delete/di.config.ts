import { configureActionHandler } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { IvyInvokeDeleteActionHandler } from './invoke-delete';

const ivyEclipseDeleteModule = new ContainerModule((bind, _unbind, isBound) => {
  configureActionHandler({ bind, isBound }, 'invoke-delete', IvyInvokeDeleteActionHandler);
});

export default ivyEclipseDeleteModule;
