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

import { AnimateFeedbackAction, AnimateFeedbackCommand } from '../../src/animate/animate-feedback-action';
import { Animateable, animateFeature } from '../../src/animate/model';

let root: SModelRoot;

@injectable()
class AnimateFeedbackCommandMock extends AnimateFeedbackCommand {
  execute(context: CommandExecutionContext): SModelRoot {
    context.root = root;
    return super.execute(context);
  }
}

class AnimationNode extends SChildElement implements Animateable {
  animated = false;
  features = createFeatureSet([animateFeature]);
}

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule);
  container.bind(GLSP_TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  configureCommand(container, AnimateFeedbackCommandMock);
  return container;
}

describe('AnimateFeedbackAction', () => {
  let actionDispatcher: ActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(new InitializeCanvasBoundsAction(EMPTY_BOUNDS));
    root = new SModelRoot();
  });

  it('Animate attribute is set on element', async () => {
    const node = new AnimationNode();
    node.id = 'foo';
    root.add(node);

    await actionDispatcher.dispatch(new AnimateFeedbackAction(['foo']));
    expect(node.animated).to.be.true;

    await actionDispatcher.dispatch(new AnimateFeedbackAction([], ['foo']));
    expect(node.animated).to.be.false;
  });
});
