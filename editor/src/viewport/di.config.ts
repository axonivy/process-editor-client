import { ContainerModule } from 'inversify';
import {
  CenterCommand,
  CenterKeyboardListener,
  configureActionHandler,
  configureCommand,
  EnableDefaultToolsAction,
  EnableToolsAction,
  GetViewportCommand,
  SetViewportAction,
  SetViewportCommand,
  TYPES,
  ZoomMouseListener
} from '@eclipse-glsp/client';

import {
  IvyFitToScreenCommand,
  IvySetViewportZoomAction,
  IvySetViewportZoomCommand,
  MoveIntoViewportCommand,
  OriginViewportCommand
} from './viewport-commands';
import { IvyScrollMouseListener } from './scroll-mouse-listener';
import { EnableViewportAction, ViewportBar } from './viewport-bar';

const ivyViewportModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(ViewportBar).toSelf().inSingletonScope();
  bind(TYPES.IUIExtension).toService(ViewportBar);
  configureActionHandler({ bind, isBound }, EnableViewportAction.KIND, ViewportBar);
  configureActionHandler({ bind, isBound }, SetViewportAction.KIND, ViewportBar);
  configureActionHandler({ bind, isBound }, IvySetViewportZoomAction.KIND, ViewportBar);

  configureCommand({ bind, isBound }, CenterCommand);
  configureCommand({ bind, isBound }, IvyFitToScreenCommand);
  configureCommand({ bind, isBound }, OriginViewportCommand);
  configureCommand({ bind, isBound }, MoveIntoViewportCommand);
  configureCommand({ bind, isBound }, GetViewportCommand);
  configureCommand({ bind, isBound }, SetViewportCommand);
  configureCommand({ bind, isBound }, IvySetViewportZoomCommand);
  bind(TYPES.KeyListener).to(CenterKeyboardListener);
  bind(TYPES.MouseListener).to(ZoomMouseListener);
  bind(IvyScrollMouseListener).toSelf().inSingletonScope();
  bind(TYPES.MouseListener).toService(IvyScrollMouseListener);

  configureActionHandler({ bind, isBound }, EnableToolsAction.KIND, IvyScrollMouseListener);
  configureActionHandler({ bind, isBound }, EnableDefaultToolsAction.KIND, IvyScrollMouseListener);
});

export default ivyViewportModule;
