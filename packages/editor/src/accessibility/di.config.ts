import {
  accessibilityModule,
  bindAsService,
  BindingContext,
  configureActionHandler,
  configureFocusTrackerTool,
  configureMoveZoom,
  configureToastTool,
  DeselectKeyTool,
  EnableKeyboardGridAction,
  FeatureModule,
  FocusDomAction,
  KeyboardGrid,
  KeyboardGridCellSelectedAction,
  KeyboardGridKeyboardEventAction,
  KeyShortcutUIExtension,
  LocalElementNavigator,
  MovementKeyTool,
  PositionNavigator,
  ResizeElementAction,
  ResizeKeyTool,
  SearchAutocompletePalette,
  SearchAutocompletePaletteTool,
  SetAccessibleKeyShortcutAction,
  TYPES
} from '@eclipse-glsp/client';
import { IvyAccessibleKeyShortcutTool } from './key-shortcut/accessible-key-shortcut-tool';
import { IvyGlobalKeyListenerTool } from './global-keylistener-tool';
import { IvyElementNavigatorTool } from './element-navigation/diagram-navigation-tool';
import { FocusDomActionHandler } from '../ui-tools/focus-dom-handler';
import { IvyResizeElementHandler } from './resize-key-tool/resize-key-handler';
import { IvyZoomKeyTool } from './zoom-key-tool';

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

    configureActionHandler(context, FocusDomAction.KIND, FocusDomActionHandler);
  },
  {
    featureId: accessibilityModule.featureId
  }
);

export function configureViewKeyTools(context: BindingContext): void {
  bindAsService(context, TYPES.IDefaultTool, MovementKeyTool);
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
  context.bind(IvyResizeElementHandler).toSelf().inSingletonScope();
  configureActionHandler(context, ResizeElementAction.KIND, IvyResizeElementHandler);
  bindAsService(context, TYPES.IDefaultTool, ResizeKeyTool);
}

function configureShortcutHelpTool(context: BindingContext): void {
  bindAsService(context, TYPES.IDefaultTool, IvyAccessibleKeyShortcutTool);
  bindAsService(context, TYPES.IUIExtension, KeyShortcutUIExtension);
  configureActionHandler(context, SetAccessibleKeyShortcutAction.KIND, KeyShortcutUIExtension);
}
