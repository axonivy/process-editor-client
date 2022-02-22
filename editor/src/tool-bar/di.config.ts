import '../../css/tool-bar.css';

import {
  configureActionHandler,
  configureCommand,
  EnableDefaultToolsAction,
  EnableToolPaletteAction,
  GLSP_TYPES
} from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { TYPES } from 'sprotty';

import { ToolBar } from './tool-bar';
import { ToolBarFeedbackCommand } from './tool-bar-feedback';
import { IvyMarqueeMouseTool } from './marquee-mouse-tool';

const ivyToolBarModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(ToolBar).toSelf().inSingletonScope();
  bind(TYPES.IUIExtension).toService(ToolBar);
  configureActionHandler({ bind, isBound }, EnableToolPaletteAction.KIND, ToolBar);
  configureActionHandler({ bind, isBound }, EnableDefaultToolsAction.KIND, ToolBar);
  configureCommand({ bind, isBound }, ToolBarFeedbackCommand);
  bind(GLSP_TYPES.ITool).to(IvyMarqueeMouseTool);
});

export default ivyToolBarModule;
