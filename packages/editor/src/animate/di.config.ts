import { FeatureModule, configureActionHandler, configureCommand } from '@eclipse-glsp/client';

import { AnimateAction } from '@axonivy/process-editor-protocol';
import { AnimateActionHandler } from './animate-action-handler';
import { AnimateFeedbackCommand } from './animate-feedback-action';

const ivyAnimateModule = new FeatureModule((bind, _unbind, isBound) => {
  bind(AnimateActionHandler).toSelf().inSingletonScope();
  configureActionHandler({ bind, isBound }, AnimateAction.KIND, AnimateActionHandler);
  configureCommand({ bind, isBound }, AnimateFeedbackCommand);
});

export default ivyAnimateModule;
