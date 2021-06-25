import { ILogger } from '@theia/core';
import { BackendApplicationContribution } from '@theia/core/lib/node';
import { ProcessErrorEvent } from '@theia/process/lib/node/process';
import { ProcessManager } from '@theia/process/lib/node/process-manager';
import { RawProcess, RawProcessFactory } from '@theia/process/lib/node/raw-process';
import * as cp from 'child_process';
import { inject, injectable } from 'inversify';

@injectable()
export class IvyProcessServerLauncher implements BackendApplicationContribution {
  @inject(RawProcessFactory) protected readonly processFactory: RawProcessFactory;
  @inject(ProcessManager) protected readonly processManager: ProcessManager;
  @inject(ILogger) private readonly logger: ILogger;

  initialize(): void {
    // Do nothing
  }

  protected spawnProcessAsync(command: string, args?: string[], options?: cp.SpawnOptions): Promise<RawProcess> {
    const rawProcess = this.processFactory({ command, args, options });
    rawProcess.errorStream.on('data', this.logError.bind(this));
    rawProcess.outputStream.on('data', this.logInfo.bind(this));
    return new Promise<RawProcess>((resolvePromise, reject) => {
      rawProcess.onError((error: ProcessErrorEvent) => {
        this.onDidFailSpawnProcess(error);
        if (error.code === 'ENOENT') {
          const guess = command.split(/\s+/).shift();
          if (guess) {
            reject(new Error(`Failed to spawn ${guess}\nPerhaps it is not on the PATH.`));
            return;
          }
        }
        reject(error);
      });
      process.nextTick(() => resolvePromise(rawProcess));
    });
  }

  protected onDidFailSpawnProcess(error: Error | ProcessErrorEvent): void {
    this.logError(error.message);
  }

  protected logError(data: string | Buffer): void {
    if (data) {
      this.logger.error(`IvyProcessServerLauncher: ${data}`);
    }
  }

  protected logInfo(data: string | Buffer): void {
    if (data) {
      this.logger.info(`IvyProcessServerLauncher: ${data}`);
    }
  }
}
