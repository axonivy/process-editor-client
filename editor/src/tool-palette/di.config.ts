import '../../css/tool-palette.css';

import { configureActionHandler, configureCommand, EnableDefaultToolsAction } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';
import { TYPES } from 'sprotty';

import { EnableToolPaletteAction, ToolPalette } from './tool-palette';
import { ToolPaletteFeedbackCommand } from './tool-palette-feedback';

const ivyToolPaletteModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(ToolPalette).toSelf().inSingletonScope();
  bind(TYPES.IUIExtension).toService(ToolPalette);
  configureActionHandler({ bind, isBound }, EnableToolPaletteAction.KIND, ToolPalette);
  configureActionHandler({ bind, isBound }, EnableDefaultToolsAction.KIND, ToolPalette);
  configureCommand({ bind, isBound }, ToolPaletteFeedbackCommand);
});

export default ivyToolPaletteModule;
