import '../../css/tool-palette.css';

import { configureActionHandler, configureCommand, EnableDefaultToolsAction, GLSP_TYPES } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { TYPES } from 'sprotty';

import { EnableToolPaletteAction, ToolPalette } from './tool-palette';
import { ToolPaletteFeedbackCommand } from './tool-palette-feedback';
import { IvyMarqueeMouseTool } from './marquee-mouse-tool';

const ivyToolPaletteModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(ToolPalette).toSelf().inSingletonScope();
  bind(TYPES.IUIExtension).toService(ToolPalette);
  configureActionHandler({ bind, isBound }, EnableToolPaletteAction.KIND, ToolPalette);
  configureActionHandler({ bind, isBound }, EnableDefaultToolsAction.KIND, ToolPalette);
  configureCommand({ bind, isBound }, ToolPaletteFeedbackCommand);
  bind(GLSP_TYPES.ITool).to(IvyMarqueeMouseTool);
});

export default ivyToolPaletteModule;
