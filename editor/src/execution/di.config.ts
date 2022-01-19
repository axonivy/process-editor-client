import { configureActionHandler, configureCommand } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { SetExecutedElementsAction, SetExecutedElementsActionHandler } from './action';
import { ExecutedFeedbackCommand } from './feedback-action';

const ivyExecutionModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(SetExecutedElementsActionHandler).toSelf().inSingletonScope();
  configureActionHandler({ bind, isBound }, SetExecutedElementsAction.KIND, SetExecutedElementsActionHandler);
  configureCommand({ bind, isBound }, ExecutedFeedbackCommand);
});

export default ivyExecutionModule;
