import { GLSPScrollMouseListener } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import {
  CenterCommand,
  CenterKeyboardListener,
  configureActionHandler,
  configureCommand,
  EnableDefaultToolsAction,
  EnableToolsAction,
  FitToScreenCommand,
  GetViewportCommand,
  SetViewportCommand,
  TYPES,
  ZoomMouseListener
} from 'sprotty';

import { OriginViewportCommand } from './original-viewport';

const ivyViewportModule = new ContainerModule((bind, _unbind, isBound) => {
  configureCommand({ bind, isBound }, CenterCommand);
  configureCommand({ bind, isBound }, FitToScreenCommand);
  configureCommand({ bind, isBound }, OriginViewportCommand);
  configureCommand({ bind, isBound }, GetViewportCommand);
  configureCommand({ bind, isBound }, SetViewportCommand);
  bind(TYPES.KeyListener).to(CenterKeyboardListener);
  bind(TYPES.MouseListener).to(ZoomMouseListener);
  bind(GLSPScrollMouseListener).toSelf().inSingletonScope();
  bind(TYPES.MouseListener).toService(GLSPScrollMouseListener);

  configureActionHandler({ bind, isBound }, EnableToolsAction.KIND, GLSPScrollMouseListener);
  configureActionHandler({ bind, isBound }, EnableDefaultToolsAction.KIND, GLSPScrollMouseListener);
});

export default ivyViewportModule;
