import { configureCommand } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { IvyBringToFrontCommand } from './zorder';

const ivyZorderModule = new ContainerModule((bind, _unbind, isBound) => {
  configureCommand({ bind, isBound }, IvyBringToFrontCommand);
});

export default ivyZorderModule;
