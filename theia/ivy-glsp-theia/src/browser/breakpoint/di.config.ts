import { configureActionHandler } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { AddBreakpointAction, BreakpointActionHandler } from './breakpoint-action-handler';

const breakpointModule = new ContainerModule((bind, _unbind, isBound) => {
    // bind(StorageService).toService(LocalStorageService);
    // bind(BreakpointManager).toSelf().inSingletonScope();
    bind(BreakpointActionHandler).toSelf().inSingletonScope();
    configureActionHandler({ bind, isBound }, AddBreakpointAction.KIND, BreakpointActionHandler);
});

export default breakpointModule;
