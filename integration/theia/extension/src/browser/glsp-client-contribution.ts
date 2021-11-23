import { Args } from '@eclipse-glsp/client';
import { MaybePromise } from '@eclipse-glsp/protocol';
import { BaseGLSPClientContribution } from '@eclipse-glsp/theia-integration';
import { injectable } from '@theia/core/shared/inversify';

import { IvyProcessLanguage } from '../common/ivy-process-language';

export interface WorkflowInitializeOptions {
  timestamp: Date;
  message: string;
}

@injectable()
export class IvyGLSPClientContribution extends BaseGLSPClientContribution {
  readonly id = IvyProcessLanguage.contributionId;
  readonly fileExtensions = IvyProcessLanguage.fileExtensions;

  protected createInitializeOptions(): MaybePromise<Args | undefined> {
    return {
      ['timestamp']: new Date().toString(),
      ['message']: 'Custom Options Available'
    };
  }
}
