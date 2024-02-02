import { createIvyDiagramContainer } from '@axonivy/process-editor';
import { ThemeMode } from '@axonivy/process-editor-protocol';
import { IDiagramOptions, createDiagramOptionsModule } from '@eclipse-glsp/client';
import { Container } from 'inversify';
import ivyNavigationModule from './navigate/di.config';
import { ivyStartupDiagramModule } from './startup';

export interface IvyDiagramOptions extends IDiagramOptions {
  highlight: string;
  selectElementIds: string | null;
  zoom: string;
  theme: ThemeMode;
}

export default function createContainer(options: IvyDiagramOptions): Container {
  // ivyNavigationModule is a replacement for navigationModule but it is already removed in the default IvyDiagramContainer
  const container = createIvyDiagramContainer('sprotty', createDiagramOptionsModule(options), ivyNavigationModule, ivyStartupDiagramModule);
  return container;
}
