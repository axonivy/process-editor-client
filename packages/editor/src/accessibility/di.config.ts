import {
  accessibilityModule,
  bindAsService,
  BindingContext,
  configureActionHandler,
  configureFocusTrackerTool,
  configureMoveZoom,
  configureToastTool,
  configureViewKeyTools,
  EnableKeyboardGridAction,
  FeatureModule,
  FocusDomAction,
  KeyboardGrid,
  KeyShortcutUIExtension,
  LocalElementNavigator,
  PositionNavigator,
  ResizeElementAction,
  ResizeElementHandler,
  SearchAutocompletePalette,
  SearchAutocompletePaletteTool,
  SetAccessibleKeyShortcutAction,
  TYPES
} from '@eclipse-glsp/client';
import { IvyAccessibleKeyShortcutTool } from './key-shortcut/accessible-key-shortcut-tool';
import { IvyResizeKeyTool } from './resize-key-tool/resize-key-tool';
import { IvyGlobalKeyListenerTool } from './global-keylistener-tool';
import { IvyElementNavigatorTool } from './element-navigation/diagram-navigation-tool';
import { ViewPortKeyboardListener } from '../ui-tools/viewport/button';
import { FocusDomActionHandler } from '../ui-tools/focus-dom-handler';

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
    configureFocusTrackerTool(context);

    bindAsService(context, TYPES.KeyListener, ViewPortKeyboardListener);
    configureActionHandler(context, FocusDomAction.KIND, FocusDomActionHandler);
  },
  {
    featureId: accessibilityModule.featureId
  }
);

function configureKeyboardControlTools(context: BindingContext): void {
  bindAsService(context, TYPES.IDefaultTool, IvyGlobalKeyListenerTool);
  bindAsService(context, TYPES.IUIExtension, KeyboardGrid);
  configureActionHandler(context, EnableKeyboardGridAction.KIND, KeyboardGrid);
}

function configureElementNavigationTool(context: BindingContext): void {
  bindAsService(context, TYPES.IDefaultTool, IvyElementNavigatorTool);
  bindAsService(context, TYPES.IElementNavigator, PositionNavigator);
  bindAsService(context, TYPES.ILocalElementNavigator, LocalElementNavigator);
}

function configureSearchPaletteModule(context: BindingContext): void {
  //tbd improve palette
  bindAsService(context, TYPES.IUIExtension, SearchAutocompletePalette);
  bindAsService(context, TYPES.IDefaultTool, SearchAutocompletePaletteTool);
}

function configureResizeTools(context: BindingContext): void {
  context.bind(ResizeElementHandler).toSelf().inSingletonScope();
  configureActionHandler(context, ResizeElementAction.KIND, ResizeElementHandler);
  bindAsService(context, TYPES.IDefaultTool, IvyResizeKeyTool);
}

function configureShortcutHelpTool(context: BindingContext): void {
  bindAsService(context, TYPES.IDefaultTool, IvyAccessibleKeyShortcutTool);
  bindAsService(context, TYPES.IUIExtension, KeyShortcutUIExtension);
  configureActionHandler(context, SetAccessibleKeyShortcutAction.KIND, KeyShortcutUIExtension);
}
