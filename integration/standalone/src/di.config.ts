import { ConsoleLogger, GLSPDiagramServer, LogLevel, TYPES } from '@eclipse-glsp/client';
import { createIvyDiagramContainer, ivyThemeModule } from '@ivyteam/process-editor';
import { Container } from 'inversify';
import ivyStandaloneBreakpointModule from './breakpoint/di.config';
import ivyDirtyStateModule from './dirty-state/di.config';
import ivyStandaloneKeyListenerModule from './key-listener/di.config';
import ivyNavigationModule from './navigate/di.config';

export default function createContainer(): Container {
  const container = createIvyDiagramContainer('sprotty');
  container.bind(GLSPDiagramServer).toSelf().inSingletonScope();
  container.bind(TYPES.ModelSource).to(GLSPDiagramServer).inSingletonScope();
  container.rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
  container.rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
  container.load(ivyStandaloneKeyListenerModule);
  container.load(ivyNavigationModule);
  container.load(ivyDirtyStateModule);
  container.load(ivyStandaloneBreakpointModule);
  container.load(ivyThemeModule);
  return container;
}
