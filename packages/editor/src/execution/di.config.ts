import './execution.css';

import { FeatureModule, configureActionHandler, configureCommand } from '@eclipse-glsp/client';

import { SetExecutedElementsAction, StoppedAction } from '@axonivy/process-editor-protocol';
import { SetExecutedElementsActionHandler, StoppedActionHandler } from './action';
import { ExecutedFeedbackCommand, StoppedFeedbackCommand } from './feedback-action';

const ivyExecutionModule = new FeatureModule((bind, _unbind, isBound) => {
  bind(SetExecutedElementsActionHandler).toSelf().inSingletonScope();
  bind(StoppedActionHandler).toSelf().inSingletonScope();
  configureActionHandler({ bind, isBound }, SetExecutedElementsAction.KIND, SetExecutedElementsActionHandler);
  configureActionHandler({ bind, isBound }, StoppedAction.KIND, StoppedActionHandler);
  configureCommand({ bind, isBound }, ExecutedFeedbackCommand);
  configureCommand({ bind, isBound }, StoppedFeedbackCommand);
});

export default ivyExecutionModule;
