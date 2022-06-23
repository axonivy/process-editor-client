import {
  FocusStateChangedAction,
  CenterCommand,
  ClosePopupActionHandler,
  configureActionHandler,
  configureCommand,
  FitToScreenCommand,
  HoverFeedbackCommand,
  HoverKeyListener,
  HoverState,
  MoveCommand,
  PopupHoverMouseListener,
  SetPopupModelCommand,
  SetViewportCommand,
  TYPES
} from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { PopupPositionUpdater } from 'sprotty/lib/features/hover/popup-position-updater';
import { IVY_TYPES } from '../types';
import { IvyHoverMouseListener } from './hover';

const ivyHoverModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(IvyHoverMouseListener).toSelf().inSingletonScope();
  bind(TYPES.MouseListener).toService(IvyHoverMouseListener);
  bind(IVY_TYPES.IvyHoverMouseListener).toService(IvyHoverMouseListener);
  bind(TYPES.PopupVNodePostprocessor).to(PopupPositionUpdater).inSingletonScope();
  bind(TYPES.PopupMouseListener).to(PopupHoverMouseListener);
  bind(TYPES.KeyListener).to(HoverKeyListener);
  bind<HoverState>(TYPES.HoverState).toConstantValue({
    mouseOverTimer: undefined,
    mouseOutTimer: undefined,
    popupOpen: false,
    previousPopupElement: undefined
  });
  bind(ClosePopupActionHandler).toSelf().inSingletonScope();

  const context = { bind, isBound };
  configureCommand(context, HoverFeedbackCommand);
  configureCommand(context, SetPopupModelCommand);
  configureActionHandler(context, SetPopupModelCommand.KIND, ClosePopupActionHandler);
  configureActionHandler(context, FitToScreenCommand.KIND, ClosePopupActionHandler);
  configureActionHandler(context, CenterCommand.KIND, ClosePopupActionHandler);
  configureActionHandler(context, SetViewportCommand.KIND, ClosePopupActionHandler);
  configureActionHandler(context, MoveCommand.KIND, ClosePopupActionHandler);
  configureActionHandler(context, FocusStateChangedAction.KIND, ClosePopupActionHandler);
});

export default ivyHoverModule;
