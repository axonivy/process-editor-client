import '../css/colors.css';

import { eclipseCopyPasteModule, eclipseDeleteModule, EclipseGLSPDiagramServer, keepAliveModule } from '@eclipse-glsp/ide';
import { ivyBreakpointModule, createIvyDiagramContainer } from '@ivyteam/process-editor';
import { Container } from 'inversify';
import { ConsoleLogger, LogLevel, TYPES } from '@eclipse-glsp/client';

import ivyOpenInscriptionModule from './open-inscription/di.config';
import ivyOpenDecoratorBrowserModule from './open-decorator-browser/di.config';
import ivyOpenQuickOutlineModule from './open-quick-outline/di.config';
import ivyEditSourceModule from './edit-source/di.config';
import ivyEditorActionModule from './editor-action/di.config';
import ivyOpenDataClassModule from './open-data-class/di.config';
import ivyToolBarModule from './tool-bar/di.config';

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
  container.load(ivyEditSourceModule);
  container.load(ivyBreakpointModule);
  container.load(ivyEditorActionModule);
  container.load(ivyOpenDataClassModule);
  container.load(ivyToolBarModule);

  return container;
}
