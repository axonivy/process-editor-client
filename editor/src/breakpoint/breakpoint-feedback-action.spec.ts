import {
  ActionDispatcher,
  CommandExecutionContext,
  configureCommand,
  createFeatureSet,
  defaultModule,
  EMPTY_BOUNDS,
  FeedbackActionDispatcher,
  GLSP_TYPES,
  InitializeCanvasBoundsAction,
  SChildElement,
  SModelRoot,
  TYPES
} from '@eclipse-glsp/client';
import { expect } from 'chai';
import { Container, injectable } from 'inversify';
import { describe, it } from 'mocha';

import { BreakpointFeedbackAction, BreakpointFeedbackCommand } from './breakpoint-feedback-action';
import { breakpointFeature, SBreakpointHandle } from './model';

let root: SModelRoot;

@injectable()
class BreakpointFeedbackCommandMock extends BreakpointFeedbackCommand {
  execute(context: CommandExecutionContext): SModelRoot {
    context.root = root;
    return super.execute(context);
  }
}

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule);
  container.bind(GLSP_TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  configureCommand(container, BreakpointFeedbackCommandMock);
  return container;
}

describe('Breakpoint Feedback Action', () => {
  let actionDispatcher: ActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(new InitializeCanvasBoundsAction(EMPTY_BOUNDS));
    root = new SModelRoot();
  });

  it('SBreakpointHandle will be added to a breakable element', async () => {
    const node = new SChildElement();
    node.id = 'foo';
    node.features = createFeatureSet([breakpointFeature]);
    root.add(node);

    await actionDispatcher.dispatch(new BreakpointFeedbackAction(['foo']));
    expect(node.children).to.have.lengthOf(1);
    expect(node.children[0]).to.be.an.instanceOf(SBreakpointHandle);

    await actionDispatcher.dispatch(new BreakpointFeedbackAction([], ['foo']));
    expect(node.children).to.be.empty;
  });

  it('SBreakpointHandle will not be added to a unbreakable element', async () => {
    const node = new SChildElement();
    node.id = 'notbreakable';
    root.add(node);

    await actionDispatcher.dispatch(new BreakpointFeedbackAction(['notbreakable']));
    expect(node.children).to.be.empty;
  });
});
