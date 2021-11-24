import '../css/diagram.css';

import {
  DEFAULT_MODULES,
  GLSP_TYPES,
  glspDecorationModule,
  glspViewportModule,
  openModule,
  overrideViewerOptions,
  zorderModule
} from '@eclipse-glsp/client';
import toolPaletteModule from '@eclipse-glsp/client/lib/features/tool-palette/di.config';
import baseViewModule from '@eclipse-glsp/client/lib/views/base-view-module';
import { Container, ContainerModule } from 'inversify';

import animateModule from './animate/di.config';
import ivyBoundaryModule from './boundary/di.config';
import ivyDecorationModule from './decorator/di.config';
import ivyDiagramModule from './diagram/di.config';
import ivyJumpModule from './jump/di.config';
import ivyLaneModule from './lanes/di.config';
import ivyQuickActionModule from './quick-action/di.config';
import ivyToolPaletteModule from './tool-palette/di.config';
import ivyViewportModule from './viewport/di.config';
import ivyWrapModule from './wrap/di.config';
import ivyZorderModule from './zorder/di.config';

export default function createContainer(widgetId: string): Container {
  const container = new Container();
  container.load(
    ...DEFAULT_MODULES.filter(isNotOverridenModule),
    baseViewModule,
    ivyDiagramModule,
    ivyToolPaletteModule,
    ivyDecorationModule,
    ivyViewportModule,
    ivyBoundaryModule,
    ivyQuickActionModule,
    ivyWrapModule,
    ivyJumpModule,
    ivyZorderModule,
    ivyLaneModule,
    animateModule
  );
  container.bind(GLSP_TYPES.IMarqueeBehavior).toConstantValue({ entireEdge: true, entireElement: true });

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
    module !== openModule
  );
}
