import './viewport-bar.css';

import {
  bindAsService,
  CenterKeyboardListener,
  configureActionHandler,
  configureCommand,
  EnableDefaultToolsAction,
  EnableToolsAction,
  FeatureModule,
  FocusDomAction,
  GetViewportCommand,
  RepositionCommand,
  RestoreViewportHandler,
  SetViewportAction,
  SetViewportCommand,
  TYPES,
  viewportModule
} from '@eclipse-glsp/client';

import { EnableViewportAction, SetViewportZoomAction } from '@axonivy/process-editor-protocol';
import { IvyScrollMouseListener } from './scroll';
import { ViewportBar } from './viewport-bar';
import {
  IvyCenterCommand,
  IvyFitToScreenCommand,
  IvySetViewportZoomCommand,
  MoveIntoViewportCommand,
  OriginViewportCommand
} from './viewport-commands';
import { IvyZoomMouseListener } from './zoom';

const ivyViewportModule = new FeatureModule(
  (bind, _unbind, isBound, rebind) => {
    const context = { bind, isBound, rebind };

    // GLSP defaults
    configureCommand(context, GetViewportCommand);
    configureCommand(context, SetViewportCommand);
    configureCommand(context, RepositionCommand);

    bindAsService(context, TYPES.IDiagramStartup, RestoreViewportHandler);
    configureActionHandler(context, EnableDefaultToolsAction.KIND, RestoreViewportHandler);
    configureActionHandler(context, FocusDomAction.KIND, RestoreViewportHandler);

    // GLSP replacements
    configureCommand(context, IvyCenterCommand);
    configureCommand(context, IvyFitToScreenCommand);
    bindAsService(context, TYPES.MouseListener, IvyZoomMouseListener);

    bind(IvyScrollMouseListener).toSelf().inSingletonScope();
    configureActionHandler(context, EnableToolsAction.KIND, IvyScrollMouseListener);
    configureActionHandler(context, EnableDefaultToolsAction.KIND, IvyScrollMouseListener);

    // Ivy extensions
    bindAsService(context, TYPES.IUIExtension, ViewportBar);
    configureActionHandler(context, EnableViewportAction.KIND, ViewportBar);
    configureActionHandler(context, SetViewportAction.KIND, ViewportBar);
    configureActionHandler(context, SetViewportZoomAction.KIND, ViewportBar);

    configureCommand(context, OriginViewportCommand);
    configureCommand(context, MoveIntoViewportCommand);
    configureCommand(context, IvySetViewportZoomCommand);
    bindAsService(context, TYPES.KeyListener, CenterKeyboardListener);
  },
  { featureId: viewportModule.featureId }
);

export default ivyViewportModule;
