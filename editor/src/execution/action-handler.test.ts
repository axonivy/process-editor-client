import {
  ActionDispatcher,
  Bounds,
  defaultModule,
  FeedbackActionDispatcher,
  InitializeCanvasBoundsAction,
  TYPES
} from '@eclipse-glsp/client';
import { describe, it, expect, beforeEach } from 'vitest';
import { Container } from 'inversify';

import { type ElementExecution, SetExecutedElementsAction, StoppedAction } from './action';
import ivyExecutionModule from './di.config';
import { ExecutedFeedbackAction, StoppedFeedbackAction } from './feedback-action';

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule, ivyExecutionModule);
  container.bind(TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  return container;
}

describe('ExecutionActionHandler', () => {
  let actionDispatcher: ActionDispatcher;
  let feedbackDispatcher: FeedbackActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    feedbackDispatcher = container.get<FeedbackActionDispatcher>(TYPES.IFeedbackActionDispatcher);
    actionDispatcher.dispatch(InitializeCanvasBoundsAction.create(Bounds.EMPTY));
  });

  it('Action handler registers the correct ExecutedFeedbackAction', async () => {
    const execution: ElementExecution = { elementId: 'foo', count: 2, failed: false };
    await actionDispatcher.dispatch(SetExecutedElementsAction.create({ elementExecutions: [execution], lastExecutedElementId: '' }));
    const firstAction = getAndAssertFeedbackAction();
    expect(firstAction.oldElementExecutions).toBeUndefined();
    expect(firstAction.elementExecutions).to.include(execution);

    await actionDispatcher.dispatch(SetExecutedElementsAction.create({ elementExecutions: [execution], lastExecutedElementId: '' }));
    const secondAction = getAndAssertFeedbackAction();
    expect(secondAction.oldElementExecutions).to.include(execution);

    function getAndAssertFeedbackAction(): ExecutedFeedbackAction {
      const feedbacks = feedbackDispatcher.getRegisteredFeedback();
      expect(feedbacks).to.have.lengthOf(1);
      expect(feedbacks[0].kind).to.be.equals('executedFeedbackCommand');
      return feedbacks[0] as ExecutedFeedbackAction;
    }
  });
});

describe('StoppedActionHandler', () => {
  let actionDispatcher: ActionDispatcher;
  let feedbackDispatcher: FeedbackActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    feedbackDispatcher = container.get<FeedbackActionDispatcher>(TYPES.IFeedbackActionDispatcher);
    actionDispatcher.dispatch(InitializeCanvasBoundsAction.create(Bounds.EMPTY));
  });

  it('Action handler registers the correct StoppedFeedbackAction', async () => {
    await actionDispatcher.dispatch(StoppedAction.create({ elementId: 'foo' }));
    const firstAction = getAndAssertFeedbackAction();
    expect(firstAction.oldStoppedElement).toBeUndefined();
    expect(firstAction.stoppedElement).to.be.equals('foo');

    await actionDispatcher.dispatch(StoppedAction.create({ elementId: 'bar' }));
    const secondAction = getAndAssertFeedbackAction();
    expect(secondAction.oldStoppedElement).to.equals('foo');
    expect(secondAction.stoppedElement).to.be.equals('bar');

    await actionDispatcher.dispatch(StoppedAction.create({}));
    expect(feedbackDispatcher.getRegisteredFeedback()).toEqual([]);

    function getAndAssertFeedbackAction(): StoppedFeedbackAction {
      const feedbacks = feedbackDispatcher.getRegisteredFeedback();
      expect(feedbacks).to.have.lengthOf(1);
      expect(feedbacks[0].kind).to.be.equals('stoppedFeedbackCommand');
      return feedbacks[0] as StoppedFeedbackAction;
    }
  });
});
