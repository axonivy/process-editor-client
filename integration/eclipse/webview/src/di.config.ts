import '../css/colors.css';

import { eclipseCopyPasteModule, eclipseDeleteModule, EclipseGLSPDiagramServer, keepAliveModule } from '@eclipse-glsp/ide';
import { createIvyDiagramContainer, ivyKeyListenerModule } from '@ivyteam/process-editor';
import { Container } from 'inversify';
import { ConsoleLogger, LogLevel, TYPES } from 'sprotty';

import ivyOpenInscriptionModule from './open-inscription/di.config';
import ivyOpenDecoratorBrowserModule from './open-decorator-browser/di.config';
import ivyOpenQuickOutlineModule from './open-quick-outline/di.config';

export default function createContainer(widgetId: string): Container {
  const container = createIvyDiagramContainer(widgetId);
  container.bind(TYPES.ModelSource).to(EclipseGLSPDiagramServer).inSingletonScope();
  container.rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
  container.rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);

  container.load(keepAliveModule);
  container.load(eclipseCopyPasteModule);
  container.load(eclipseDeleteModule);
  container.load(ivyOpenInscriptionModule);
  container.load(ivyOpenDecoratorBrowserModule);
  container.load(ivyOpenQuickOutlineModule);

  const agent = userAgent();
  // saidly there is now nice name reported
  const isLinuxEclipseEmbeddedBrowser = agent.indexOf('Linux') >= 0 && agent.indexOf('Version') >= 0;
  const isMac = agent.indexOf('Mac') >= 0;
  if (!(isLinuxEclipseEmbeddedBrowser || isMac)) {
    // hack to prevent that actions are executed twice in the eclipse ide under linux and mac
    container.load(ivyKeyListenerModule);
  }

  return container;
}

function userAgent(): string {
  return typeof navigator !== 'undefined' ? navigator.userAgent : '';
}
