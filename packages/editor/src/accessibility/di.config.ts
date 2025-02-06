import {
  accessibilityModule,
  bindAsService,
  BindingContext,
  configureActionHandler,
  configureElementNavigationTool,
  configureMoveZoom,
  configureSearchPaletteModule,
  configureShortcutHelpTool,
  configureToastTool,
  DeselectKeyTool,
  EnableKeyboardGridAction,
  FeatureModule,
  FocusDomAction,
  KeyboardGrid,
  KeyboardGridCellSelectedAction,
  KeyboardGridKeyboardEventAction,
  ResizeElementAction,
  ResizeKeyTool,
  TYPES
} from '@eclipse-glsp/client';
import { IvyGlobalKeyListenerTool } from './global-keylistener-tool';
import { IvyResizeElementHandler } from './resize-key-tool/resize-key-handler';
import { IvyZoomKeyTool } from './view-key-tool/zoom-key-tool';
import { FocusDomActionHandler } from './focus-dom-handler';
import { IvyMovementKeyTool } from './view-key-tool/movement-key-tool';

export const ivyAccessibilityModule = new FeatureModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    configureResizeTools(context);
    configureViewKeyTools(context);
    configureMoveZoom(context);
    configureSearchPaletteModule(context);
    configureShortcutHelpTool(context);
    configureKeyboardControlTools(context);
    configureElementNavigationTool(context);
    configureToastTool(context);
    configureActionHandler(context, FocusDomAction.KIND, FocusDomActionHandler);
  },
  {
    featureId: accessibilityModule.featureId
  }
);

function configureResizeTools(context: BindingContext): void {
  context.bind(IvyResizeElementHandler).toSelf().inSingletonScope();
  configureActionHandler(context, ResizeElementAction.KIND, IvyResizeElementHandler);
  bindAsService(context, TYPES.IDefaultTool, ResizeKeyTool);
}

export function configureViewKeyTools(context: BindingContext): void {
  bindAsService(context, TYPES.IDefaultTool, IvyMovementKeyTool);
  bindAsService(context, TYPES.IDefaultTool, IvyZoomKeyTool);
  configureActionHandler(context, KeyboardGridCellSelectedAction.KIND, IvyZoomKeyTool);
  configureActionHandler(context, KeyboardGridKeyboardEventAction.KIND, IvyZoomKeyTool);
  bindAsService(context, TYPES.IDefaultTool, DeselectKeyTool);
}

function configureKeyboardControlTools(context: BindingContext): void {
  bindAsService(context, TYPES.IDefaultTool, IvyGlobalKeyListenerTool);
  bindAsService(context, TYPES.IUIExtension, KeyboardGrid);
  configureActionHandler(context, EnableKeyboardGridAction.KIND, KeyboardGrid);
}
