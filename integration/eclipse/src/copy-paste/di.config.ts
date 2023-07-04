import { configureActionHandler } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { IvyEclipseCopyPasteActionHandler } from './copy-paste';

const ivyEclipseCopyPasteModule = new ContainerModule((bind, _unbind, isBound) => {
  configureActionHandler({ bind, isBound }, 'invoke-copy', IvyEclipseCopyPasteActionHandler);
  configureActionHandler({ bind, isBound }, 'invoke-cut', IvyEclipseCopyPasteActionHandler);
  configureActionHandler({ bind, isBound }, 'invoke-paste', IvyEclipseCopyPasteActionHandler);
});

export default ivyEclipseCopyPasteModule;
