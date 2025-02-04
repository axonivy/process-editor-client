import {
  accessibilityModule,
  bindAsService,
  BindingContext,
  configureActionHandler,
  configureKeyboardControlTools,
  configureMoveZoom,
  configureToastTool,
  configureViewKeyTools,
  FeatureModule,
  GlobalKeyListenerTool,
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

export const ivyAccessibilityModule = new FeatureModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    configureResizeTools(context);
    configureViewKeyTools(context);
    configureMoveZoom(context);
    configureSearchPaletteModule(context);
    configureShortcutHelpTool(context);
    configureKeyboardControlTools(context);
    rebind(GlobalKeyListenerTool).to(IvyGlobalKeyListenerTool);
    configureElementNavigationTool(context);
    configureToastTool(context);

    bindAsService(context, TYPES.KeyListener, ViewPortKeyboardListener);
  },
  {
    featureId: accessibilityModule.featureId
  }
);

export function configureElementNavigationTool(context: BindingContext): void {
  bindAsService(context, TYPES.IDefaultTool, IvyElementNavigatorTool);
  bindAsService(context, TYPES.IElementNavigator, PositionNavigator);
  bindAsService(context, TYPES.ILocalElementNavigator, LocalElementNavigator);
}

export function configureSearchPaletteModule(context: Pick<BindingContext, 'bind'>): void {
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
