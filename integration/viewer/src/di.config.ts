import {
  createIvyDiagramContainer,
  ivyChangeBoundsToolModule,
  ivyConnectorModule,
  ivyKeyListenerModule,
  ivyLabelEditModule,
  ivyLabelEditUiModule,
  ivyLaneModule,
  ivyNodeCreationToolModule,
  ivyQuickActionModule,
  ivyThemeModule,
  ivyWrapModule
} from '@axonivy/process-editor';
import { ThemeMode } from '@axonivy/process-editor-protocol';
import { IDiagramOptions, createDiagramOptionsModule, deletionToolModule, edgeEditToolModule } from '@eclipse-glsp/client';
import { Container } from 'inversify';
import ivyNavigationModule from './navigate/di.config';
import { ivyStartupDiagramModule } from './startup';
import ivyViewerQuickActionModule from './quick-action/di.config';
import ivyViewerKeyListenerModule from './key-listener/di.config';

export interface IvyDiagramOptions extends IDiagramOptions {
  highlight: string;
  select: string | null;
  zoom: string;
  theme: ThemeMode;
}

export default function createContainer(options: IvyDiagramOptions): Container {
  // ivyNavigationModule is a replacement for navigationModule but it is already removed in the default IvyDiagramContainer
  const container = createIvyDiagramContainer(
    'sprotty',
    createDiagramOptionsModule(options),
    ivyThemeModule,
    ivyNavigationModule,
    ivyStartupDiagramModule,
    {
      remove: [
        ivyLabelEditModule,
        ivyLabelEditUiModule,
        ivyChangeBoundsToolModule,
        ivyNodeCreationToolModule,
        ivyWrapModule,
        ivyLaneModule,
        ivyConnectorModule,
        deletionToolModule,
        edgeEditToolModule
      ]
    },
    { remove: ivyQuickActionModule, add: ivyViewerQuickActionModule },
    { remove: ivyKeyListenerModule, add: ivyViewerKeyListenerModule }
  );
  return container;
}
