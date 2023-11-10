/* eslint-disable no-unused-expressions */
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
import { describe, test, expect, beforeEach } from 'vitest';
import { Container } from 'inversify';

import { AnimateActionHandler } from './animate-action-handler';
import { AnimateFeedbackAction, AnimateFeedbackCommand } from './animate-feedback-action';
import { AnimateAction } from '@axonivy/process-editor-protocol';
import { MoveIntoViewportCommand } from '../ui-tools/viewport/viewport-commands';

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule);
  container.bind(TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  container.bind(AnimateActionHandler).toSelf().inSingletonScope();
  configureActionHandler(container, AnimateAction.KIND, AnimateActionHandler);
  configureCommand(container, AnimateFeedbackCommand);
  configureCommand(container, CenterCommand);
  configureCommand(container, MoveIntoViewportCommand);
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

  test('Action handler registers the correct AnimateFeedbackAction', async () => {
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
