import {
  IVY_TYPES,
  InfoQuickActionProvider,
  QuickActionUI,
  ShowInfoQuickActionMenuAction,
  ShowQuickActionMenuAction
} from '@axonivy/process-editor';
import { FeatureModule, RemoveMarqueeAction, TYPES, bindAsService, configureActionHandler } from '@eclipse-glsp/client';

const ivyViewerQuickActionModule = new FeatureModule((bind, _unbind, isBound) => {
  bindAsService(bind, TYPES.IUIExtension, QuickActionUI);

  configureActionHandler({ bind, isBound }, ShowQuickActionMenuAction.KIND, QuickActionUI);
  configureActionHandler({ bind, isBound }, ShowInfoQuickActionMenuAction.KIND, QuickActionUI);
  configureActionHandler({ bind, isBound }, RemoveMarqueeAction.KIND, QuickActionUI);

  bind(IVY_TYPES.QuickActionProvider).to(InfoQuickActionProvider);
});

export default ivyViewerQuickActionModule;
