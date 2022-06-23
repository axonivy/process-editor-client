import { getPort, GLSPSocketServerContribution, GLSPSocketServerContributionOptions } from '@eclipse-glsp/theia-integration/lib/node';
import { injectable } from '@theia/core/shared/inversify';
import { join } from 'path';

import { IvyProcessLanguage } from '../common/ivy-process-language';

export const DEFAULT_PORT = 5007;
export const PORT_ARG_KEY = 'IVY_PROCESS_GLSP';
export const SERVER_DIR = join(__dirname, '..', '..', 'server');

@injectable()
export class IvyGLSPServerContribution extends GLSPSocketServerContribution {
  readonly id = IvyProcessLanguage.contributionId;

  createContributionOptions(): Partial<GLSPSocketServerContributionOptions> {
    return {
      executable: '',
      additionalArgs: ['--consoleLog', 'false', '--fileLog', 'true', '--logDir', SERVER_DIR],
      socketConnectionOptions: {
        port: getPort(PORT_ARG_KEY, DEFAULT_PORT)
      },
      launchedExternally: true
    };
  }
}
