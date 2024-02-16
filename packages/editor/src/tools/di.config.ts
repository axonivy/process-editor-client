import {
  DrawHelperLinesFeedbackCommand,
  ExportSvgCommand,
  ExportSvgPostprocessor,
  FeatureModule,
  GLSPHiddenBoundsUpdater,
  HelperLineManager,
  HideChangeBoundsToolResizeFeedbackCommand,
  SResizeHandle,
  SResizeHandleView,
  ShowChangeBoundsToolResizeFeedbackCommand,
  TYPES,
  bindAsService,
  boundsModule,
  changeBoundsToolModule,
  configureActionHandler,
  configureCommand,
  configureView,
  elementTemplateModule,
  exportModule,
  helperLineModule,
  nodeCreationToolModule
} from '@eclipse-glsp/client';

import { TriggerNodeCreationAction } from '@eclipse-glsp/protocol';
import { IvyMarqueeMouseTool } from '../ui-tools/tool-bar/marquee-mouse-tool';
import { IvyChangeBoundsTool } from './change-bounds-tool';
import { IvySvgExporter } from './export/ivy-svg-exporter';
import { IvyDrawHelpersLineFeedbackCommand } from './helper-line-feedback';
import { IvyHelperLineManager } from './ivy-helper-line-manager';
import { IvyHiddenBoundsUpdater } from './ivy-hidden-bounds-updater';
import { IvyNodeCreationTool } from './node-creation-tool';
import './helper-line.css';

export const ivyChangeBoundsToolModule = new FeatureModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    // GSLP defaults
    configureCommand(context, ShowChangeBoundsToolResizeFeedbackCommand);
    configureCommand(context, HideChangeBoundsToolResizeFeedbackCommand);
    configureView(context, SResizeHandle.TYPE, SResizeHandleView);

    // GLSP replacements
    bindAsService(context, TYPES.IDefaultTool, IvyChangeBoundsTool);
  },
  { featureId: changeBoundsToolModule.featureId }
);

export const ivyNodeCreationToolModule = new FeatureModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    // GLSP replacements
    bindAsService(context, TYPES.ITool, IvyNodeCreationTool);
    configureActionHandler(context, TriggerNodeCreationAction.KIND, IvyNodeCreationTool);
  },
  { featureId: nodeCreationToolModule.featureId, requires: elementTemplateModule }
);

export const ivyExportModule = new FeatureModule(
  (bind, _unbind, isBound) => {
    const context = { bind, isBound };
    // GLSP defaults
    bindAsService(context, TYPES.HiddenVNodePostprocessor, ExportSvgPostprocessor);
    configureCommand(context, ExportSvgCommand);

    // GLSP replacements
    bindAsService(context, TYPES.SvgExporter, IvySvgExporter);
  },
  { featureId: exportModule.featureId }
);

export const ivyMarqueeSelectionToolModule = new FeatureModule(bind => {
  // Ivy extensions
  bindAsService(bind, TYPES.ITool, IvyMarqueeMouseTool);
});

export const ivyHelperLineExtensionModule = new FeatureModule(
  (bind, _unbind, _isBound, rebind) => {
    rebind(DrawHelperLinesFeedbackCommand).to(IvyDrawHelpersLineFeedbackCommand);
    bind(IvyHelperLineManager).toSelf().inSingletonScope();
    rebind(HelperLineManager).toService(IvyHelperLineManager);
  },
  { featureId: helperLineModule.featureId }
);

export const ivyBoundsExtensionModule = new FeatureModule(
  (bind, _unbind, _isBound, rebind) => {
    bind(IvyHiddenBoundsUpdater).toSelf().inSingletonScope();
    rebind(GLSPHiddenBoundsUpdater).toService(IvyHiddenBoundsUpdater);
  },
  { featureId: boundsModule.featureId }
);
