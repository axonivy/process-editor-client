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

import { ShowBreakpointAction, ShowBreakpointActionHandler } from '../../src/breakpoint/action-handler';
import { BreakpointFeedbackAction, BreakpointFeedbackCommand } from '../../src/breakpoint/feedback-action';

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
    const elementBreakpoint = { elementId: 'foo', condition: '', disabled: false };
    await actionDispatcher.dispatch(new ShowBreakpointAction([elementBreakpoint], false));
    let action = getAndAssertBreakpointFeedbackAction();
    expect(action.breakpoints).to.include(elementBreakpoint);
    expect(action.oldBreakpoints).to.be.empty;
    expect(action.globalDisabled).to.be.false;

    await actionDispatcher.dispatch(new ShowBreakpointAction([elementBreakpoint], true));
    action = getAndAssertBreakpointFeedbackAction();
    expect(action.breakpoints).to.include(elementBreakpoint);
    expect(action.oldBreakpoints).to.include(elementBreakpoint);
    expect(action.globalDisabled).to.be.true;

    await actionDispatcher.dispatch(new ShowBreakpointAction([], false));
    action = getAndAssertBreakpointFeedbackAction();
    expect(action.breakpoints).to.be.empty;
    expect(action.oldBreakpoints).to.include(elementBreakpoint);
    expect(action.globalDisabled).to.be.false;

    function getAndAssertBreakpointFeedbackAction(): BreakpointFeedbackAction {
      const feedbacks = feedbackDispatcher.getRegisteredFeedback();
      expect(feedbacks).to.have.lengthOf(1);
      expect(feedbacks[0]).to.be.an.instanceOf(BreakpointFeedbackAction);
      return feedbacks[0] as BreakpointFeedbackAction;
    }
  });
});
