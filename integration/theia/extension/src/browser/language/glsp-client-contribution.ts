import { BaseGLSPClientContribution } from '@eclipse-glsp/theia-integration/lib/browser';
import { injectable } from 'inversify';

import { IvyProcessLanguage } from '../../common/ivy-process-language';

@injectable()
export class IvyGLSPClientContribution extends BaseGLSPClientContribution {
  readonly id = IvyProcessLanguage.Id;
  readonly name = IvyProcessLanguage.Name;
  readonly fileExtensions = [IvyProcessLanguage.FileExtension];
}
