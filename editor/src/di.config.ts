import '../css/diagram.css';

import {
  boundsModule,
  buttonModule,
  defaultGLSPModule,
  defaultModule,
  edgeLayoutModule,
  expandModule,
  exportModule,
  fadeModule,
  glspContextMenuModule,
  glspEditLabelModule,
  glspHoverModule,
  glspMouseToolModule,
  glspSelectModule,
  glspServerCopyPasteModule,
  glspViewportModule,
  labelEditUiModule,
  layoutCommandsModule,
  markerNavigatorModule,
  modelHintsModule,
  modelSourceModule,
  overrideViewerOptions,
  routingModule,
  toolFeedbackModule,
  toolsModule,
  validationModule,
  zorderModule
} from '@eclipse-glsp/client';
import baseViewModule from '@eclipse-glsp/client/lib/views/base-view-module';
import { Container } from 'inversify';

import animateModule from './animate/di.config';
import ivyDecorationModule from './decorator/di.config';
import ivyDiagramModule from './diagram/di.config';
import ivyQuickActionModule from './quick-action/di.config';
import ivyToolPaletteModule from './tool-palette/di.config';
import ivyWrapModule from './wrap/di.config';

export default function createContainer(widgetId: string): Container {
  const container = new Container();

  container.load(validationModule,
    defaultModule,
    glspMouseToolModule,
    defaultGLSPModule,
    glspSelectModule,
    boundsModule,
    glspViewportModule,
    toolsModule,
    baseViewModule,
    glspHoverModule,
    fadeModule,
    exportModule,
    expandModule,
    buttonModule,
    modelSourceModule,
    labelEditUiModule,
    glspEditLabelModule,
    ivyDiagramModule,
    toolFeedbackModule,
    modelHintsModule,
    glspServerCopyPasteModule,
    routingModule,
    ivyToolPaletteModule,
    ivyDecorationModule,
    edgeLayoutModule,
    zorderModule,
    layoutCommandsModule,
    ivyQuickActionModule,
    ivyWrapModule,
    glspContextMenuModule,
    animateModule,
    markerNavigatorModule);

  overrideViewerOptions(container, {
    baseDiv: widgetId,
    hiddenDiv: widgetId + '_hidden'
  });

  return container;
}
