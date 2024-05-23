import {
  ChangeBoundsManager,
  ChangeBoundsTool,
  ExportSvgCommand,
  ExportSvgPostprocessor,
  FeatureModule,
  HideChangeBoundsToolResizeFeedbackCommand,
  SResizeHandle,
  ShowChangeBoundsToolResizeFeedbackCommand,
  TYPES,
  bindAsService,
  changeBoundsToolModule,
  configureCommand,
  configureView,
  exportModule
} from '@eclipse-glsp/client';

import { IvySvgExporter } from './export/ivy-svg-exporter';
import './helper-line.css';
import { ShowNegativeAreaFeedbackCommand } from './negative-area/model';
import { IvyChangeBoundsManager } from './ivy-change-bounds-manager';
import { IvyResizeHandleView } from '../diagram/views';

export const ivyChangeBoundsToolModule = new FeatureModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    // GSLP defaults
    configureCommand(context, ShowChangeBoundsToolResizeFeedbackCommand);
    configureCommand(context, HideChangeBoundsToolResizeFeedbackCommand);
    bindAsService(context, TYPES.IDefaultTool, ChangeBoundsTool);

    // GLSP replacements
    bindAsService(context, ChangeBoundsManager, IvyChangeBoundsManager);
    configureView(context, SResizeHandle.TYPE, IvyResizeHandleView);

    // extension
    configureCommand(context, ShowNegativeAreaFeedbackCommand);
  },
  { featureId: changeBoundsToolModule.featureId }
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
