import {
  ActionDispatcher,
  configureActionHandler,
  configureCommand,
  defaultModule,
  EMPTY_BOUNDS,
  FeedbackActionDispatcher,
  GLSP_TYPES,
  InitializeCanvasBoundsAction,
  TYPES
} from '@eclipse-glsp/client';
import { expect } from 'chai';
import { Container } from 'inversify';
import { describe, it } from 'mocha';

import { ElementExecution, SetExecutedElementsAction, SetExecutedElementsActionHandler } from '../../src/execution/action';
import { ExecutedFeedbackAction, ExecutedFeedbackCommand } from '../../src/execution/feedback-action';

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule);
  container.bind(GLSP_TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  container.bind(SetExecutedElementsActionHandler).toSelf().inSingletonScope();
  configureActionHandler(container, SetExecutedElementsAction.KIND, SetExecutedElementsActionHandler);
  configureCommand(container, ExecutedFeedbackCommand);
  return container;
}

describe('AnimateActionHandler', () => {
  let actionDispatcher: ActionDispatcher;
  let feedbackDispatcher: FeedbackActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    feedbackDispatcher = container.get<FeedbackActionDispatcher>(GLSP_TYPES.IFeedbackActionDispatcher);
    actionDispatcher.dispatch(new InitializeCanvasBoundsAction(EMPTY_BOUNDS));
  });

  it('Action handler registers the correct ExecutedFeedbackAction', async () => {
    const execution: ElementExecution = { elementId: 'foo', count: 2, failed: false };
    await actionDispatcher.dispatch(new SetExecutedElementsAction([execution]));
    const firstAction = getAndAssertFeedbackAction();
    expect(firstAction.oldElementExecutions).to.be.empty;
    expect(firstAction.elementExecutions).to.include(execution);

    await actionDispatcher.dispatch(new SetExecutedElementsAction([execution]));
    const secondAction = getAndAssertFeedbackAction();
    expect(secondAction.oldElementExecutions).to.include(execution);

    function getAndAssertFeedbackAction(): ExecutedFeedbackAction {
      const feedbacks = feedbackDispatcher.getRegisteredFeedback();
      expect(feedbacks).to.have.lengthOf(1);
      expect(feedbacks[0]).to.be.an.instanceOf(ExecutedFeedbackAction);
      return feedbacks[0] as ExecutedFeedbackAction;
    }
  });
});
