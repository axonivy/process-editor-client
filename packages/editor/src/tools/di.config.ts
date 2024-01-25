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
  exportModule,
  nodeCreationToolModule
} from '@eclipse-glsp/client';

import { TriggerNodeCreationAction } from '@eclipse-glsp/protocol';
import { IvyChangeBoundsTool } from './change-bounds-tool';
import { IvySvgExporter } from './export/ivy-svg-exporter';
import { IvyNodeCreationTool } from './node-creation-tool';

export const ivyChangeBoundsToolModule = new FeatureModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    bindAsService(context, TYPES.IDefaultTool, IvyChangeBoundsTool);
    configureCommand(context, ShowChangeBoundsToolResizeFeedbackCommand);
    configureCommand(context, HideChangeBoundsToolResizeFeedbackCommand);
    configureView(context, SResizeHandle.TYPE, SResizeHandleView);
  },
  { featureId: changeBoundsToolModule.featureId }
);

export const ivyNodeCreationToolModule = new FeatureModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    bindAsService(context, TYPES.ITool, IvyNodeCreationTool);
    configureActionHandler(context, TriggerNodeCreationAction.KIND, IvyNodeCreationTool);
  },
  { featureId: nodeCreationToolModule.featureId }
);

export const ivyExportModule = new FeatureModule(
  (bind, _unbind, isBound) => {
    const context = { bind, isBound };
    bindAsService(context, TYPES.HiddenVNodePostprocessor, ExportSvgPostprocessor);
    bindAsService(context, TYPES.SvgExporter, IvySvgExporter);
    configureCommand(context, ExportSvgCommand);
  },
  { featureId: exportModule.featureId }
);
