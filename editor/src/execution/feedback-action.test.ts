import {
  ActionDispatcher,
  Bounds,
  type CommandExecutionContext,
  configureCommand,
  createFeatureSet,
  defaultModule,
  FeedbackActionDispatcher,
  InitializeCanvasBoundsAction,
  SChildElement,
  SModelRoot,
  TYPES
} from '@eclipse-glsp/client';
import { describe, it, expect, beforeEach } from 'vitest';
import { Container, injectable } from 'inversify';
import type { ElementExecution } from './action';

import { ExecutedFeedbackAction, ExecutedFeedbackCommand, StoppedFeedbackAction, StoppedFeedbackCommand } from './feedback-action';
import { executionFeature } from './model';

let executedRoot: SModelRoot;
let stoppedRoot: SModelRoot;

@injectable()
class ExecutedFeedbackCommandMock extends ExecutedFeedbackCommand {
  execute(context: CommandExecutionContext): SModelRoot {
    context.root = executedRoot;
    return super.execute(context);
  }
}

@injectable()
class StoppedFeedbackCommandMock extends StoppedFeedbackCommand {
  execute(context: CommandExecutionContext): SModelRoot {
    context.root = stoppedRoot;
    return super.execute(context);
  }
}

class Node extends SChildElement {
  features = createFeatureSet([executionFeature]);
}

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule);
  container.bind(TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  configureCommand(container, ExecutedFeedbackCommandMock);
  configureCommand(container, StoppedFeedbackCommandMock);
  return container;
}

describe('ExecutedFeedbackAction', () => {
  let actionDispatcher: ActionDispatcher;
  executedRoot = new SModelRoot();
  const node = new Node();
  node.id = 'foo';
  executedRoot.add(node);

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(InitializeCanvasBoundsAction.create(Bounds.EMPTY));
    node.cssClasses = undefined;
  });

  it('Executed css class is set on element', async () => {
    const execution: ElementExecution = { elementId: 'foo', count: 2, failed: false };

    await actionDispatcher.dispatch(
      ExecutedFeedbackAction.create({ elementExecutions: [execution], oldElementExecutions: [], lastExecutedElementId: node.id })
    );
    expect(node.cssClasses).to.include('executed');
    expect(node.cssClasses).to.include('last');
    await actionDispatcher.dispatch(
      ExecutedFeedbackAction.create({ elementExecutions: [], oldElementExecutions: [execution], lastExecutedElementId: '' })
    );
    expect(node.cssClasses).to.not.include('executed');
  });

  it('Failed css class is set on element', async () => {
    const execution: ElementExecution = { elementId: 'foo', count: 2, failed: true };

    await actionDispatcher.dispatch(
      ExecutedFeedbackAction.create({ elementExecutions: [execution], oldElementExecutions: [], lastExecutedElementId: '' })
    );
    expect(node.cssClasses).to.include('failed');
    await actionDispatcher.dispatch(
      ExecutedFeedbackAction.create({ elementExecutions: [], oldElementExecutions: [execution], lastExecutedElementId: '' })
    );
    expect(node.cssClasses).to.not.include('failed');
  });
});

describe('StoppedFeedbackAction', () => {
  let actionDispatcher: ActionDispatcher;
  stoppedRoot = new SModelRoot();
  const node = new Node();
  node.id = 'foo';
  stoppedRoot.add(node);

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(InitializeCanvasBoundsAction.create(Bounds.EMPTY));
    node.cssClasses = undefined;
  });

  it('Stopped css class is set on element', async () => {
    await actionDispatcher.dispatch(StoppedFeedbackAction.create({ oldStoppedElement: '', stoppedElement: 'foo' }));
    expect(node.cssClasses).to.include('stopped');
    await actionDispatcher.dispatch(StoppedFeedbackAction.create({ oldStoppedElement: 'foo' }));
    expect(node.cssClasses).to.not.include('stopped');
  });
});
