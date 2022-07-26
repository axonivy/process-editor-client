import '../../css/execution.css';

import { configureActionHandler, configureCommand } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { SetExecutedElementsAction, SetExecutedElementsActionHandler, StoppedAction, StoppedActionHandler } from './action';
import { ExecutedFeedbackCommand, StoppedFeedbackCommand } from './feedback-action';

const ivyExecutionModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(SetExecutedElementsActionHandler).toSelf().inSingletonScope();
  bind(StoppedActionHandler).toSelf().inSingletonScope();
  configureActionHandler({ bind, isBound }, SetExecutedElementsAction.KIND, SetExecutedElementsActionHandler);
  configureActionHandler({ bind, isBound }, StoppedAction.KIND, StoppedActionHandler);
  configureCommand({ bind, isBound }, ExecutedFeedbackCommand);
  configureCommand({ bind, isBound }, StoppedFeedbackCommand);
});

export default ivyExecutionModule;
