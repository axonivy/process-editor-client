import {
  createIvyDiagramContainer,
  ivyBreakpointModule,
  ivyGoToSourceModule,
  ivyOpenDataClassModule,
  ivyOpenDecoratorBrowserModule,
  ivyOpenFormModule,
  ivyStartActionModule,
  ivyThemeModule
} from '@axonivy/process-editor';
import type { Container } from 'inversify';

import { ivyInscriptionModule } from '@axonivy/process-editor-inscription';
import ivyEclipseCopyPasteModule from './copy-paste/di.config';
import ivyEclipseDeleteModule from './delete/di.config';
import ivyOpenQuickOutlineModule from './open-quick-outline/di.config';
import type { IDiagramOptions } from '@eclipse-glsp/client';
import { createDiagramOptionsModule, standaloneExportModule } from '@eclipse-glsp/client';
import type { ThemeMode } from '@axonivy/process-editor-protocol';
import { ivyStartupDiagramModule as ivyStartupDiagramModule } from './startup';

export interface IvyDiagramOptions extends IDiagramOptions {
  theme: ThemeMode;
  showGrid: boolean;
}

export default function createContainer(widgetId: string, options: IvyDiagramOptions): Container {
  const container = createIvyDiagramContainer(
    widgetId,
    createDiagramOptionsModule(options),
    ivyThemeModule,
    ivyEclipseCopyPasteModule,
    ivyEclipseDeleteModule,
    ivyOpenDecoratorBrowserModule,
    ivyOpenQuickOutlineModule,
    ivyGoToSourceModule,
    ivyBreakpointModule,
    ivyStartActionModule,
    ivyOpenDataClassModule,
    ivyOpenFormModule,
    ivyInscriptionModule,
    ivyStartupDiagramModule,
    standaloneExportModule
  );

  return container;
}
