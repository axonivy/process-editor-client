import '../css/colors.css';

import { eclipseCopyPasteModule, eclipseDeleteModule, EclipseGLSPDiagramServer, keepAliveModule } from '@eclipse-glsp/ide';
import { createIvyDiagramContainer } from '@ivyteam/process-editor';
import { Container } from 'inversify';
import { ConsoleLogger, LogLevel, TYPES } from 'sprotty';

import ivyOpenModule from './open/di.config';

export default function createContainer(widgetId: string): Container {
  const container = createIvyDiagramContainer(widgetId);
  container.bind(TYPES.ModelSource).to(EclipseGLSPDiagramServer).inSingletonScope();
  container.rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
  container.rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);

  container.load(keepAliveModule);
  container.load(eclipseCopyPasteModule);
  container.load(eclipseDeleteModule);
  container.load(ivyOpenModule);

  return container;
}
