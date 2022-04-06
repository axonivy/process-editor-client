import { ContainerModule } from 'inversify';
import {
  CenterCommand,
  CenterKeyboardListener,
  configureActionHandler,
  configureCommand,
  EnableDefaultToolsAction,
  EnableToolsAction,
  GetViewportCommand,
  SetViewportCommand,
  TYPES,
  ZoomMouseListener
} from 'sprotty';

import { IvyFitToScreenCommand, MoveIntoViewportCommand, OriginViewportCommand } from './viewport-commands';
import { IvyScrollMouseListener } from './scroll-mouse-listener';

const ivyViewportModule = new ContainerModule((bind, _unbind, isBound) => {
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
