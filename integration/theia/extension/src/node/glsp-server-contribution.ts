import { getPort } from '@eclipse-glsp/protocol';
import { JavaSocketServerContribution, JavaSocketServerLaunchOptions } from '@eclipse-glsp/theia-integration/lib/node';
import { injectable } from 'inversify';
import { join } from 'path';

import { IvyProcessLanguage } from '../common/ivy-process-language';

export const DEFAULT_PORT = 5007;
export const PORT_ARG_KEY = 'IVY_PROCESS_GLSP';
export const SERVER_DIR = join(__dirname, '..', '..', 'server');

@injectable()
export class IvyGLSPServerContribution extends JavaSocketServerContribution {
  readonly id = IvyProcessLanguage.Id;
  readonly name = IvyProcessLanguage.Name;

  createLaunchOptions(): Partial<JavaSocketServerLaunchOptions> {
    return {
      jarPath: '',
      additionalArgs: ['--consoleLog', 'false',
        '--fileLog', 'true',
        '--logDir', SERVER_DIR],
      serverPort: getPort(PORT_ARG_KEY, DEFAULT_PORT),
      launchedExternally: true
    };
  }

  async launch(): Promise<void> {
    if (this.launchOptions.launchedExternally) {
      this.resolveReady();
      return this.onReady;
    }
    return super.launch();
  }
}
