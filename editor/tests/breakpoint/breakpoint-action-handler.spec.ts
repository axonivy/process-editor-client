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

import { ShowBreakpointAction, ShowBreakpointActionHandler } from '../../src/breakpoint/breakpoint-action-handler';
import { BreakpointFeedbackAction, BreakpointFeedbackCommand } from '../../src/breakpoint/breakpoint-feedback-action';

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule);
  container.bind(GLSP_TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  container.bind(ShowBreakpointActionHandler).toSelf().inSingletonScope();
  configureActionHandler(container, ShowBreakpointAction.KIND, ShowBreakpointActionHandler);
  configureCommand(container, BreakpointFeedbackCommand);
  return container;
}

describe('ShowBreakpointActionHandler', () => {
  let actionDispatcher: ActionDispatcher;
  let feedbackDispatcher: FeedbackActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    feedbackDispatcher = container.get<FeedbackActionDispatcher>(GLSP_TYPES.IFeedbackActionDispatcher);
    actionDispatcher.dispatch(new InitializeCanvasBoundsAction(EMPTY_BOUNDS));
  });

  it('Action handler creates the correct BreakpointFeedbackAction', async () => {

    await actionDispatcher.dispatch(new ShowBreakpointAction(['foo']));
    let action = getAndAssertBreakpointFeedbackAction();
    expect(action.showBreakpointElementIds).to.include('foo');
    expect(action.hideBreakpointElementIds).to.be.empty;

    await actionDispatcher.dispatch(new ShowBreakpointAction([]));
    action = getAndAssertBreakpointFeedbackAction();
    expect(action.showBreakpointElementIds).to.be.empty;
    expect(action.hideBreakpointElementIds).to.include('foo');

    function getAndAssertBreakpointFeedbackAction(): BreakpointFeedbackAction {
      const feedbacks = feedbackDispatcher.getRegisteredFeedback();
      expect(feedbacks).to.have.lengthOf(1);
      expect(feedbacks[0]).to.be.an.instanceOf(BreakpointFeedbackAction);
      return feedbacks[0] as BreakpointFeedbackAction;
    }
  });
});
