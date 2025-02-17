import {
  ActionDispatcher,
  Bounds,
  configureActionHandler,
  configureCommand,
  defaultModule,
  FeedbackActionDispatcher,
  InitializeCanvasBoundsAction,
  TYPES
} from '@eclipse-glsp/client';
import { describe, it, expect, beforeEach } from 'vitest';
import { Container } from 'inversify';

import { ShowBreakpointAction, ShowBreakpointActionHandler } from './action-handler';
import { BreakpointFeedbackAction, BreakpointFeedbackCommand } from './feedback-action';

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule);
  container.bind(TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
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
    feedbackDispatcher = container.get<FeedbackActionDispatcher>(TYPES.IFeedbackActionDispatcher);
    actionDispatcher.dispatch(InitializeCanvasBoundsAction.create(Bounds.EMPTY));
  });

  it('Action handler creates the correct BreakpointFeedbackAction', async () => {
    const elementBreakpoint = { elementId: 'foo', condition: '', disabled: false };
    await actionDispatcher.dispatch(ShowBreakpointAction.create({ elementBreakpoints: [elementBreakpoint], globalDisabled: false }));
    let action = getAndAssertBreakpointFeedbackAction();
    expect(action.breakpoints).to.include(elementBreakpoint);
    expect(action.oldBreakpoints).toEqual([]);
    expect(action.globalDisabled).toBeFalsy();

    await actionDispatcher.dispatch(ShowBreakpointAction.create({ elementBreakpoints: [elementBreakpoint], globalDisabled: true }));
    action = getAndAssertBreakpointFeedbackAction();
    expect(action.breakpoints).to.include(elementBreakpoint);
    expect(action.oldBreakpoints).to.include(elementBreakpoint);
    expect(action.globalDisabled).toBeTruthy();

    await actionDispatcher.dispatch(ShowBreakpointAction.create({ elementBreakpoints: [], globalDisabled: false }));
    action = getAndAssertBreakpointFeedbackAction();
    expect(action.breakpoints).toEqual([]);
    expect(action.oldBreakpoints).to.include(elementBreakpoint);
    expect(action.globalDisabled).toBeFalsy();

    function getAndAssertBreakpointFeedbackAction(): BreakpointFeedbackAction {
      const feedbacks = feedbackDispatcher.getRegisteredFeedback();
      expect(feedbacks).to.have.lengthOf(1);
      expect(feedbacks[0].kind).to.be.equals('elementBreakpointFeedback');
      return feedbacks[0] as BreakpointFeedbackAction;
    }
  });
});
