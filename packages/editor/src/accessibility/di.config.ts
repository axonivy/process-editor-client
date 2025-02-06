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
import { IvyResizeElementHandler } from './resize-key-tool/resize-key-handler';
import { IvyZoomKeyTool } from './view-key-tool/zoom-key-tool';
import { FocusDomActionHandler } from './focus-dom-handler';
import { IvyMovementKeyTool } from './view-key-tool/movement-key-tool';
import { IvyGlobalKeyListenerTool } from './key-listener/global-keylistener-tool';
import { QuickActionKeyListener } from './key-listener/quick-actions';
import { JumpOutKeyListener } from './key-listener/jump-out';

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
    configureIvyKeyListeners(context);
  },
  {
    featureId: accessibilityModule.featureId
  }
);

export const ivyKeyListenerModule = new FeatureModule((bind, unbind, isBound, rebind) => {
  const context = { bind, unbind, isBound, rebind };
  configureIvyKeyListeners(context);
});

function configureResizeTools(context: BindingContext) {
  context.bind(IvyResizeElementHandler).toSelf().inSingletonScope();
  configureActionHandler(context, ResizeElementAction.KIND, IvyResizeElementHandler);
  bindAsService(context, TYPES.IDefaultTool, ResizeKeyTool);
}

function configureViewKeyTools(context: BindingContext) {
  bindAsService(context, TYPES.IDefaultTool, IvyMovementKeyTool);
  bindAsService(context, TYPES.IDefaultTool, IvyZoomKeyTool);
  configureActionHandler(context, KeyboardGridCellSelectedAction.KIND, IvyZoomKeyTool);
  configureActionHandler(context, KeyboardGridKeyboardEventAction.KIND, IvyZoomKeyTool);
  bindAsService(context, TYPES.IDefaultTool, DeselectKeyTool);
}

function configureKeyboardControlTools(context: BindingContext) {
  bindAsService(context, TYPES.IDefaultTool, IvyGlobalKeyListenerTool);
  bindAsService(context, TYPES.IUIExtension, KeyboardGrid);
  configureActionHandler(context, EnableKeyboardGridAction.KIND, KeyboardGrid);
}

function configureIvyKeyListeners({ bind }: BindingContext) {
  bind(TYPES.KeyListener).to(QuickActionKeyListener);
  bind(TYPES.KeyListener).to(JumpOutKeyListener);
}
