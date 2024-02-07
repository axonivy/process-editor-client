import {
  createIvyDiagramContainer,
  ivyBreakpointModule,
  ivyGoToSourceModule,
  ivyOpenDataClassModule,
  ivyOpenDecoratorBrowserModule,
  ivyOpenInscriptionModule,
  ivyStartActionModule
} from '@axonivy/process-editor';
import { Container } from 'inversify';

import { ivyInscriptionModule } from '@axonivy/process-editor-inscription';
import ivyEclipseCopyPasteModule from './copy-paste/di.config';
import ivyEclipseDeleteModule from './delete/di.config';
import ivyOpenQuickOutlineModule from './open-quick-outline/di.config';
import { IDiagramOptions, createDiagramOptionsModule } from '@eclipse-glsp/client';
import { ThemeMode } from '@axonivy/process-editor-protocol';
import { ivyStartupDiagramModule as ivyStartupDiagramModule } from './startup';

export interface IvyDiagramOptions extends IDiagramOptions {
  theme: ThemeMode;
  showGrid: boolean;
}

export default function createContainer(widgetId: string, options: IvyDiagramOptions): Container {
  const container = createIvyDiagramContainer(
    widgetId,
    createDiagramOptionsModule(options),
    ivyEclipseCopyPasteModule,
    ivyEclipseDeleteModule,
    ivyOpenInscriptionModule,
    ivyOpenDecoratorBrowserModule,
    ivyOpenQuickOutlineModule,
    ivyGoToSourceModule,
    ivyBreakpointModule,
    ivyStartActionModule,
    ivyOpenDataClassModule,
    ivyInscriptionModule,
    ivyStartupDiagramModule
  );

  return container;
}
