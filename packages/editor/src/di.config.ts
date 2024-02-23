import {
  ConsoleLogger,
  ContainerConfiguration,
  DEFAULT_ALIGNABLE_ELEMENT_FILTER,
  IHelperLineOptions,
  LogLevel,
  TYPES,
  baseViewModule,
  bindOrRebind,
  changeBoundsToolModule,
  decorationModule,
  exportModule,
  feedbackEdgeEndId,
  feedbackEdgeId,
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
  zorderModule,
  statusModule
} from '@eclipse-glsp/client';
import { Container } from 'inversify';
import ivyAnimateModule from './animate/di.config';
import ivyConnectorModule from './connector/di.config';
import ivyDecorationModule from './decorator/di.config';
import ivyDiagramModule from './diagram/di.config';
import { LaneNode } from './diagram/model';
import { IvyGridSnapper } from './diagram/snap';
import { ivyLabelEditModule, ivyLabelEditUiModule } from './edit-label/di.config';
import ivyExecutionModule from './execution/di.config';
import { IvyGLSPCommandStack } from './ivy-command-stack';
import ivyJumpModule from './jump/di.config';
import ivyKeyListenerModule from './key-listener/di.config';
import ivyLaneModule from './lanes/di.config';
import { ivyNotificationModule } from './notification/di.config';
import { IvyViewerOptions, defaultIvyViewerOptions } from './options';
import ivyThemeModule from './theme/di.config';
import {
  ivyBoundsExtensionModule,
  ivyChangeBoundsToolModule,
  ivyExportModule,
  ivyHelperLineExtensionModule,
  ivyMarqueeSelectionToolModule,
  ivyNodeCreationToolModule
} from './tools/di.config';
import { IVY_TYPES } from './types';
import ivyQuickActionModule from './ui-tools/quick-action/di.config';
import ivyToolBarModule from './ui-tools/tool-bar/di.config';
import ivyViewportModule from './ui-tools/viewport/di.config';
import ivyWrapModule from './wrap/di.config';
import ivyZorderModule from './zorder/di.config';
import '@axonivy/ui-icons/lib/ivy-icons.css';
import 'toastify-js/src/toastify.css';
import './colors.css';
import './hidden.css';
import './toastify.css';

export default function createContainer(widgetId: string, ...containerConfiguration: ContainerConfiguration): Container {
  const container = initializeDiagramContainer(
    new Container(),
    // removals: not needed defaults
    { remove: [hoverModule, navigationModule, statusModule] },

    // GLSP additions
    baseViewModule,
    helperLineModule,

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

    // Ivy additions
    ivyDiagramModule,
    ivyQuickActionModule,
    ivyWrapModule,
    ivyJumpModule,
    ivyLaneModule,
    ivyAnimateModule,
    ivyExecutionModule,
    ivyConnectorModule,
    ivyKeyListenerModule,
    ivyNotificationModule,
    ivyMarqueeSelectionToolModule,
    ivyThemeModule,

    // Ivy extensions:
    ivyHelperLineExtensionModule,
    ivyBoundsExtensionModule,

    // additional configurations
    ...containerConfiguration
  );

  // configurations
  container.bind<IvyViewerOptions>(IVY_TYPES.IvyViewerOptions).toConstantValue(defaultIvyViewerOptions());
  container.bind<IHelperLineOptions>(TYPES.IHelperLineOptions).toConstantValue({
    alignmentEpsilon: 0, // positions must match perfectly, we already restrict movement to the grid and only use integer positions (no decimals)
    minimumMoveDelta: { x: IvyGridSnapper.GRID.x * 2, y: IvyGridSnapper.GRID.y * 2 },
    alignmentElementFilter: element =>
      !(element instanceof LaneNode) &&
      !(element.id === feedbackEdgeId(element.root)) &&
      !(element.id === feedbackEdgeEndId(element.root)) &&
      DEFAULT_ALIGNABLE_ELEMENT_FILTER(element)
  });

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
