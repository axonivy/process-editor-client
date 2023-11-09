import { ConsoleLogger, LogLevel, TYPES } from '@eclipse-glsp/client';
import { createIvyDiagramContainer, ivyThemeModule, IvyGLSPDiagramServer } from '@axonivy/process-editor';
import { Container } from 'inversify';
import ivyNavigationModule from './navigate/di.config';

export default function createContainer(): Container {
  const container = createIvyDiagramContainer('sprotty');
  container.bind(IvyGLSPDiagramServer).toSelf().inSingletonScope();
  container.bind(TYPES.ModelSource).to(IvyGLSPDiagramServer).inSingletonScope();
  container.rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
  container.rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
  container.load(ivyNavigationModule);
  container.load(ivyThemeModule);
  return container;
}
