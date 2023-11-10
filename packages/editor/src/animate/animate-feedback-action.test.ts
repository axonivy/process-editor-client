import {
  ActionDispatcher,
  Bounds,
  CommandExecutionContext,
  configureCommand,
  createFeatureSet,
  defaultModule,
  FeedbackActionDispatcher,
  InitializeCanvasBoundsAction,
  SChildElement,
  SModelRoot,
  TYPES
} from '@eclipse-glsp/client';
import { describe, test, expect, beforeEach } from 'vitest';
import { Container, injectable } from 'inversify';

import { AnimateFeedbackAction, AnimateFeedbackCommand } from './animate-feedback-action';
import { animateFeature } from './model';

let root: SModelRoot;

@injectable()
class AnimateFeedbackCommandMock extends AnimateFeedbackCommand {
  execute(context: CommandExecutionContext): SModelRoot {
    context.root = root;
    return super.execute(context);
  }
}

class AnimationNode extends SChildElement {
  features = createFeatureSet([animateFeature]);
}

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule);
  container.bind(TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  configureCommand(container, AnimateFeedbackCommandMock);
  return container;
}

describe('AnimateFeedbackAction', () => {
  let actionDispatcher: ActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(InitializeCanvasBoundsAction.create(Bounds.EMPTY));
    root = new SModelRoot();
  });

  test('Animate css class is set on element', async () => {
    const node = new AnimationNode();
    node.id = 'foo';
    root.add(node);

    await actionDispatcher.dispatch(AnimateFeedbackAction.create({ animatedIDs: ['foo'] }));
    expect(node.cssClasses).to.include('animate');

    await actionDispatcher.dispatch(AnimateFeedbackAction.create({ animatedIDs: [], deAnimatedIDs: ['foo'] }));
    expect(node.cssClasses).to.not.include('animate');
  });
});
