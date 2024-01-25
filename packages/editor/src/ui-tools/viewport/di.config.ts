import './viewport-bar.css';

import {
  CenterCommand,
  CenterKeyboardListener,
  configureActionHandler,
  configureCommand,
  EnableDefaultToolsAction,
  EnableToolsAction,
  FeatureModule,
  GetViewportCommand,
  SetViewportAction,
  SetViewportCommand,
  TYPES,
  viewportModule
} from '@eclipse-glsp/client';

import { EnableViewportAction, SetViewportZoomAction } from '@axonivy/process-editor-protocol';
import { IvyScrollMouseListener } from './scroll';
import { ViewportBar } from './viewport-bar';
import { IvyFitToScreenCommand, IvySetViewportZoomCommand, MoveIntoViewportCommand, OriginViewportCommand } from './viewport-commands';
import { IvyZoomMouseListener } from './zoom';

const ivyViewportModule = new FeatureModule(
  (bind, _unbind, isBound) => {
    bind(ViewportBar).toSelf().inSingletonScope();
    bind(TYPES.IUIExtension).toService(ViewportBar);
    configureActionHandler({ bind, isBound }, EnableViewportAction.KIND, ViewportBar);
    configureActionHandler({ bind, isBound }, SetViewportAction.KIND, ViewportBar);
    configureActionHandler({ bind, isBound }, SetViewportZoomAction.KIND, ViewportBar);

    configureCommand({ bind, isBound }, CenterCommand);
    configureCommand({ bind, isBound }, IvyFitToScreenCommand);
    configureCommand({ bind, isBound }, OriginViewportCommand);
    configureCommand({ bind, isBound }, MoveIntoViewportCommand);
    configureCommand({ bind, isBound }, GetViewportCommand);
    configureCommand({ bind, isBound }, SetViewportCommand);
    configureCommand({ bind, isBound }, IvySetViewportZoomCommand);
    bind(TYPES.KeyListener).to(CenterKeyboardListener);
    bind(TYPES.MouseListener).to(IvyZoomMouseListener);
    bind(IvyScrollMouseListener).toSelf().inSingletonScope();
    bind(TYPES.MouseListener).toService(IvyScrollMouseListener);

    configureActionHandler({ bind, isBound }, EnableToolsAction.KIND, IvyScrollMouseListener);
    configureActionHandler({ bind, isBound }, EnableDefaultToolsAction.KIND, IvyScrollMouseListener);
  },
  { featureId: viewportModule.featureId }
);

export default ivyViewportModule;
