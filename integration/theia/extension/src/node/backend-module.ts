import { GLSPServerContribution } from '@eclipse-glsp/theia-integration/lib/node';
import { ContainerModule } from '@theia/core/shared/inversify';

import { IvyGLSPServerContribution } from './glsp-server-contribution';

export default new ContainerModule(bind => {
  bind(IvyGLSPServerContribution).toSelf().inSingletonScope();
  bind(GLSPServerContribution).toService(IvyGLSPServerContribution);
});
