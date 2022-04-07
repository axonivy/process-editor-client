import { EnableToolPaletteAction } from '@eclipse-glsp/client';
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
} from 'sprotty';

import { IvyFitToScreenCommand, MoveIntoViewportCommand, OriginViewportCommand } from './viewport-commands';
import { IvyScrollMouseListener } from './scroll-mouse-listener';
import { ViewportBar } from './viewport-bar';

const ivyViewportModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(ViewportBar).toSelf().inSingletonScope();
  bind(TYPES.IUIExtension).toService(ViewportBar);
  configureActionHandler({ bind, isBound }, EnableToolPaletteAction.KIND, ViewportBar);
  configureActionHandler({ bind, isBound }, SetViewportAction.KIND, ViewportBar);

  configureCommand({ bind, isBound }, CenterCommand);
  configureCommand({ bind, isBound }, IvyFitToScreenCommand);
  configureCommand({ bind, isBound }, OriginViewportCommand);
  configureCommand({ bind, isBound }, MoveIntoViewportCommand);
  configureCommand({ bind, isBound }, GetViewportCommand);
  configureCommand({ bind, isBound }, SetViewportCommand);
  bind(TYPES.KeyListener).to(CenterKeyboardListener);
  bind(TYPES.MouseListener).to(ZoomMouseListener);
  bind(IvyScrollMouseListener).toSelf().inSingletonScope();
  bind(TYPES.MouseListener).toService(IvyScrollMouseListener);

  configureActionHandler({ bind, isBound }, EnableToolsAction.KIND, IvyScrollMouseListener);
  configureActionHandler({ bind, isBound }, EnableDefaultToolsAction.KIND, IvyScrollMouseListener);
});

export default ivyViewportModule;
