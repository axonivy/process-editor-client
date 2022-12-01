import { getPort, GLSPSocketServerContribution, GLSPSocketServerContributionOptions } from '@eclipse-glsp/theia-integration/lib/node';
import { injectable } from '@theia/core/shared/inversify';
import { join } from 'path';

import { IvyProcessLanguage } from '../common/ivy-process-language';

export const DEFAULT_PORT = 5007;
export const PORT_ARG_KEY = 'IVY_PROCESS_GLSP_PORT';
export const HOST_ARG_KEY = 'IVY_PROCESS_GLSP_HOST';
export const SERVER_DIR = join(__dirname, '..', '..', 'server');

@injectable()
export class IvyGLSPServerContribution extends GLSPSocketServerContribution {
  readonly id = IvyProcessLanguage.contributionId;

  createContributionOptions(): Partial<GLSPSocketServerContributionOptions> {
    console.log('my host: ' + getHost(HOST_ARG_KEY));
    return {
      executable: '',
      additionalArgs: ['--consoleLog', 'false', '--fileLog', 'true', '--logDir', SERVER_DIR],
      socketConnectionOptions: {
        port: getPort(PORT_ARG_KEY, DEFAULT_PORT),
        host: getHost(HOST_ARG_KEY)
      },
      launchedExternally: true
    };
  }
}

function getHost(argsKey: string): string | undefined {
  argsKey = '--' + HOST_ARG_KEY + '=';
  const args = process.argv.filter(a => a.startsWith(argsKey));
  if (args.length > 0) {
    return args[0].substring(argsKey.length);
  }
  return undefined;
}
