import {
  ActionDispatcher,
  CenterCommand,
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

import { AnimateAction, AnimateActionHandler } from './animate-action-handler';
import { AnimateFeedbackAction, AnimateFeedbackCommand } from './animate-feedback-action';

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule);
  container.bind(GLSP_TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  container.bind(AnimateActionHandler).toSelf().inSingletonScope();
  configureActionHandler(container, AnimateAction.KIND, AnimateActionHandler);
  configureCommand(container, AnimateFeedbackCommand);
  configureCommand(container, CenterCommand);
  return container;
}

describe('Animate Action Handler', () => {
  let actionDispatcher: ActionDispatcher;
  let feedbackDispatcher: FeedbackActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    feedbackDispatcher = container.get<FeedbackActionDispatcher>(GLSP_TYPES.IFeedbackActionDispatcher);
    actionDispatcher.dispatch(new InitializeCanvasBoundsAction(EMPTY_BOUNDS));
  });

  it('Action handler registers the correct AnimateFeedbackAction', async () => {
    await actionDispatcher.dispatch(new AnimateAction(['foo']));
    const action = getAndAssertFeedbackAction();
    expect(action.animatedIDs).to.include('foo');
    expect(action.deAnimatedIDs).to.be.empty;

    await new Promise(r => setTimeout(r, 2100));
    expect(feedbackDispatcher.getRegisteredFeedback()).to.have.lengthOf(0);

    function getAndAssertFeedbackAction(): AnimateFeedbackAction {
      const feedbacks = feedbackDispatcher.getRegisteredFeedback();
      expect(feedbacks).to.have.lengthOf(1);
      expect(feedbacks[0]).to.be.an.instanceOf(AnimateFeedbackAction);
      return feedbacks[0] as AnimateFeedbackAction;
    }
  });
});
