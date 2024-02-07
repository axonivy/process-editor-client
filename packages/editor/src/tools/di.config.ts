import {
  ExportSvgCommand,
  ExportSvgPostprocessor,
  FeatureModule,
  HideChangeBoundsToolResizeFeedbackCommand,
  SResizeHandle,
  SResizeHandleView,
  ShowChangeBoundsToolResizeFeedbackCommand,
  TYPES,
  bindAsService,
  changeBoundsToolModule,
  configureActionHandler,
  configureCommand,
  configureView,
  elementTemplateModule,
  exportModule,
  nodeCreationToolModule
} from '@eclipse-glsp/client';

import { TriggerNodeCreationAction } from '@eclipse-glsp/protocol';
import { IvyMarqueeMouseTool } from '../ui-tools/tool-bar/marquee-mouse-tool';
import { IvyChangeBoundsTool } from './change-bounds-tool';
import { IvySvgExporter } from './export/ivy-svg-exporter';
import { IvyNodeCreationTool } from './node-creation-tool';

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
