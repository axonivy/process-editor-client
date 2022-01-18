import { configureActionHandler, configureCommand } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { AnimateAction, AnimateActionHandler } from './animate-action-handler';
import { AnimateFeedbackCommand } from './animate-feedback-action';

const ivyAnimateModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(AnimateActionHandler).toSelf().inSingletonScope();
  configureActionHandler({ bind, isBound }, AnimateAction.KIND, AnimateActionHandler);
  configureCommand({ bind, isBound }, AnimateFeedbackCommand);
});

export default ivyAnimateModule;
