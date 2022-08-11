import '../css/colors.css';
import '../icons/dist/StreamlineIcons.css';

import {
  DEFAULT_MODULES,
  TYPES,
  glspDecorationModule,
  glspViewportModule,
  openModule,
  overrideViewerOptions,
  zorderModule,
  glspHoverModule,
  toolsModule,
  navigationModule,
  glspEditLabelModule
} from '@eclipse-glsp/client';
import toolPaletteModule from '@eclipse-glsp/client/lib/features/tool-palette/di.config';
import baseViewModule from '@eclipse-glsp/client/lib/views/base-view-module';
import { Container, ContainerModule } from 'inversify';

import ivyAnimateModule from './animate/di.config';
import ivyDecorationModule from './decorator/di.config';
import ivyDiagramModule from './diagram/di.config';
import ivyJumpModule from './jump/di.config';
import ivyLaneModule from './lanes/di.config';
import ivyQuickActionModule from './ui-tools/quick-action/di.config';
import ivyToolBarModule from './ui-tools/tool-bar/di.config';
import ivyViewportModule from './ui-tools/viewport/di.config';
import ivyWrapModule from './wrap/di.config';
import ivyZorderModule from './zorder/di.config';
import ivyExecutionModule from './execution/di.config';
import ivyConnectorModule from './connector/di.config';
import ivyToolsModule from './tools/di.config';
import ivyEditLabelModule from './edit-label/di.config';
import ivyKeyListenerModule from './key-listener/di.config';
import { IvyViewerOptions, defaultIvyViewerOptions } from './options';
import { IVY_TYPES } from './types';

export default function createContainer(widgetId: string): Container {
  const container = new Container();
  container.load(
    ...DEFAULT_MODULES.filter(isNotOverridenModule),
    baseViewModule,
    ivyDiagramModule,
    ivyToolBarModule,
    ivyDecorationModule,
    ivyViewportModule,
    ivyQuickActionModule,
    ivyWrapModule,
    ivyJumpModule,
    ivyZorderModule,
    ivyLaneModule,
    ivyAnimateModule,
    ivyExecutionModule,
    ivyConnectorModule,
    ivyToolsModule,
    ivyEditLabelModule,
    ivyKeyListenerModule
  );
  container.bind(TYPES.IMarqueeBehavior).toConstantValue({ entireEdge: true, entireElement: true });
  container.bind<IvyViewerOptions>(IVY_TYPES.IvyViewerOptions).toConstantValue(defaultIvyViewerOptions());

  overrideViewerOptions(container, {
    baseDiv: widgetId,
    hiddenDiv: widgetId + '_hidden'
  });

  return container;
}

function isNotOverridenModule(module: ContainerModule): boolean {
  return (
    module !== toolPaletteModule &&
    module !== glspDecorationModule &&
    module !== glspViewportModule &&
    module !== zorderModule &&
    module !== openModule &&
    module !== glspHoverModule &&
    module !== toolsModule &&
    module !== navigationModule &&
    module !== glspEditLabelModule
  );
}
