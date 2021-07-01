import '../css/diagram.css';

import { GLSPDiagramServer } from '@eclipse-glsp/client';
import { createIvyDiagramContainer } from '@ivyteam/process-editor';
import { Container } from 'inversify';
import { ConsoleLogger, LogLevel, TYPES } from 'sprotty';

export default function createContainer(): Container {
  const container = createIvyDiagramContainer('sprotty');
  container.bind(TYPES.ModelSource).to(GLSPDiagramServer).inSingletonScope();
  container.rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
  container.rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
  return container;
}
