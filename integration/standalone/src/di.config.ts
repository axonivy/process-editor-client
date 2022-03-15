import { GLSPDiagramServer } from '@eclipse-glsp/client';
import { eclipseCopyPasteModule } from '@eclipse-glsp/ide';
import { createIvyDiagramContainer, ivyKeyListenerModule } from '@ivyteam/process-editor';
import { Container } from 'inversify';
import { ConsoleLogger, LogLevel, TYPES } from 'sprotty';
import ivyNavigateModule from './navigate/di.config';

export default function createContainer(): Container {
  const container = createIvyDiagramContainer('sprotty');
  container.bind(GLSPDiagramServer).toSelf().inSingletonScope();
  container.bind(TYPES.ModelSource).to(GLSPDiagramServer).inSingletonScope();
  container.rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
  container.rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
  container.load(ivyKeyListenerModule);
  container.load(eclipseCopyPasteModule);
  container.load(ivyNavigateModule);
  return container;
}
