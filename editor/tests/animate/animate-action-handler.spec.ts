import {
  ActionDispatcher,
  Bounds,
  CenterCommand,
  configureActionHandler,
  configureCommand,
  defaultModule,
  FeedbackActionDispatcher,
  InitializeCanvasBoundsAction,
  TYPES
} from '@eclipse-glsp/client';
import { expect } from 'chai';
import { Container } from 'inversify';

import { AnimateAction, AnimateActionHandler } from '../../src/animate/animate-action-handler';
import { AnimateFeedbackAction, AnimateFeedbackCommand } from '../../src/animate/animate-feedback-action';

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule);
  container.bind(TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  container.bind(AnimateActionHandler).toSelf().inSingletonScope();
  configureActionHandler(container, AnimateAction.KIND, AnimateActionHandler);
  configureCommand(container, AnimateFeedbackCommand);
  configureCommand(container, CenterCommand);
  return container;
}

describe('AnimateActionHandler', () => {
  let actionDispatcher: ActionDispatcher;
  let feedbackDispatcher: FeedbackActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    feedbackDispatcher = container.get<FeedbackActionDispatcher>(TYPES.IFeedbackActionDispatcher);
    actionDispatcher.dispatch(InitializeCanvasBoundsAction.create(Bounds.EMPTY));
  });

  it('Action handler registers the correct AnimateFeedbackAction', async () => {
    await actionDispatcher.dispatch(AnimateAction.create({ elementIds: ['foo'] }));
    const action = getAndAssertFeedbackAction();
    expect(action.animatedIDs).to.include('foo');
    expect(action.deAnimatedIDs).to.be.undefined;

    await new Promise(r => setTimeout(r, 2100));
    expect(feedbackDispatcher.getRegisteredFeedback()).to.have.lengthOf(0);

    function getAndAssertFeedbackAction(): AnimateFeedbackAction {
      const feedbacks = feedbackDispatcher.getRegisteredFeedback();
      expect(feedbacks).to.have.lengthOf(1);
      expect(feedbacks[0].kind).to.be.equals('elementAnimateFeedback');
      return feedbacks[0] as AnimateFeedbackAction;
    }
  });
});
