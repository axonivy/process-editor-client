import '../../css/execution.css';

import { configureActionHandler, configureCommand } from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { SetExecutedElementsActionHandler, StoppedActionHandler } from './action';
import { ExecutedFeedbackCommand, StoppedFeedbackCommand } from './feedback-action';
import { SetExecutedElementsAction, StoppedAction } from '@axonivy/process-editor-protocol';

const ivyExecutionModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(SetExecutedElementsActionHandler).toSelf().inSingletonScope();
  bind(StoppedActionHandler).toSelf().inSingletonScope();
  configureActionHandler({ bind, isBound }, SetExecutedElementsAction.KIND, SetExecutedElementsActionHandler);
  configureActionHandler({ bind, isBound }, StoppedAction.KIND, StoppedActionHandler);
  configureCommand({ bind, isBound }, ExecutedFeedbackCommand);
  configureCommand({ bind, isBound }, StoppedFeedbackCommand);
});

export default ivyExecutionModule;
