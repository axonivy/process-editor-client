import {
  accessibilityModule,
  bindAsService,
  BindingContext,
  configureActionHandler,
  configureElementNavigationTool,
  configureKeyboardControlTools,
  configureMoveZoom,
  configureViewKeyTools,
  FeatureModule,
  KeyShortcutUIExtension,
  ResizeElementAction,
  ResizeElementHandler,
  SearchAutocompletePalette,
  SearchAutocompletePaletteTool,
  SetAccessibleKeyShortcutAction,
  TYPES
} from '@eclipse-glsp/client';
import { IvyAccessibleKeyShortcutTool } from './key-shortcut/accessible-key-shortcut-tool';
import { IvyResizeKeyTool } from './resize-key-tool/resize-key-tool';

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
    // configureToastTool(context);
    // configureFocusTrackerTool(context);
    // configureKeyboardToolPaletteTool(context);
  },
  {
    featureId: accessibilityModule.featureId
  }
);

export function configureSearchPaletteModule(context: Pick<BindingContext, 'bind'>): void {
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
