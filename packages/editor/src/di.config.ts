import '@axonivy/editor-icons/lib/ivy-icons.css';
import 'toastify-js/src/toastify.css';
import './colors.css';
import './toastify.css';

import {
  ConsoleLogger,
  ContainerConfiguration,
  LogLevel,
  TYPES,
  baseViewModule,
  bindOrRebind,
  changeBoundsToolModule,
  decorationModule,
  exportModule,
  helperLineModule,
  hoverModule,
  initializeDiagramContainer,
  labelEditModule,
  labelEditUiModule,
  navigationModule,
  nodeCreationToolModule,
  overrideViewerOptions,
  toolPaletteModule,
  viewportModule,
  zorderModule
} from '@eclipse-glsp/client';
import { Container } from 'inversify';

import ivyAnimateModule from './animate/di.config';
import ivyConnectorModule from './connector/di.config';
import ivyDecorationModule from './decorator/di.config';
import ivyDiagramModule from './diagram/di.config';
import { ivyLabelEditModule, ivyLabelEditUiModule } from './edit-label/di.config';
import ivyExecutionModule from './execution/di.config';
import { IvyGLSPCommandStack } from './ivy-command-stack';
import ivyJumpModule from './jump/di.config';
import ivyKeyListenerModule from './key-listener/di.config';
import ivyLaneModule from './lanes/di.config';
import { IvyViewerOptions, defaultIvyViewerOptions } from './options';
import { ivyChangeBoundsToolModule, ivyExportModule, ivyNodeCreationToolModule } from './tools/di.config';
import { IVY_TYPES } from './types';
import ivyQuickActionModule from './ui-tools/quick-action/di.config';
import ivyToolBarModule from './ui-tools/tool-bar/di.config';
import ivyViewportModule from './ui-tools/viewport/di.config';
import ivyWrapModule from './wrap/di.config';
import ivyZorderModule from './zorder/di.config';
import { ivyNotificationModule } from './notification/di.config';
import ivyThemeModule from './theme/di.config';

export default function createContainer(widgetId: string, ...containerConfiguration: ContainerConfiguration): Container {
  const container = initializeDiagramContainer(
    new Container(),
    // removals: not needed defaults
    { remove: [hoverModule, navigationModule] },

    // replacements:
    // ensure that replacements have the same featureId as the original modules to properly handle
    // dependencies/requirements between modules as otherwise some other modules might not be loaded
    { remove: viewportModule, add: ivyViewportModule },
    { remove: decorationModule, add: ivyDecorationModule },
    { remove: zorderModule, add: ivyZorderModule },
    { remove: toolPaletteModule, add: ivyToolBarModule },
    { remove: labelEditModule, add: ivyLabelEditModule },
    { remove: labelEditUiModule, add: ivyLabelEditUiModule },
    { remove: changeBoundsToolModule, add: ivyChangeBoundsToolModule },
    { remove: nodeCreationToolModule, add: ivyNodeCreationToolModule },
    { remove: exportModule, add: ivyExportModule },

    // additions to the default modules
    baseViewModule,
    ivyDiagramModule,
    helperLineModule,
    ivyQuickActionModule,
    ivyWrapModule,
    ivyJumpModule,
    ivyLaneModule,
    ivyAnimateModule,
    ivyExecutionModule,
    ivyConnectorModule,
    ivyKeyListenerModule,
    ivyNotificationModule,
    ivyThemeModule,

    // additional configurations
    ...containerConfiguration
  );
  container.bind<IvyViewerOptions>(IVY_TYPES.IvyViewerOptions).toConstantValue(defaultIvyViewerOptions());

  bindOrRebind(container, TYPES.IMarqueeBehavior).toConstantValue({ entireEdge: true, entireElement: true });
  bindOrRebind(container, TYPES.ICommandStack).to(IvyGLSPCommandStack).inSingletonScope();
  bindOrRebind(container, TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
  bindOrRebind(container, TYPES.LogLevel).toConstantValue(LogLevel.warn);

  overrideViewerOptions(container, {
    baseDiv: widgetId,
    hiddenDiv: widgetId + '_hidden'
  });

  return container;
}
