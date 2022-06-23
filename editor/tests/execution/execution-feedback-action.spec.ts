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
import { expect } from 'chai';
import { Container, injectable } from 'inversify';
import { ElementExecution } from '../../src/execution/action';

import { ExecutedFeedbackAction, ExecutedFeedbackCommand } from '../../src/execution/feedback-action';
import { executionFeature } from '../../src/execution/model';

let root: SModelRoot;

@injectable()
class ExecutedFeedbackCommandMock extends ExecutedFeedbackCommand {
  execute(context: CommandExecutionContext): SModelRoot {
    context.root = root;
    return super.execute(context);
  }
}

class ExecutionNode extends SChildElement {
  features = createFeatureSet([executionFeature]);
}

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule);
  container.bind(TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  configureCommand(container, ExecutedFeedbackCommandMock);
  return container;
}

describe('ExecutedFeedbackAction', () => {
  let actionDispatcher: ActionDispatcher;
  root = new SModelRoot();
  const node = new ExecutionNode();
  node.id = 'foo';
  root.add(node);

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(InitializeCanvasBoundsAction.create(Bounds.EMPTY));
    node.cssClasses = undefined;
  });

  it('Executed css class is set on element', async () => {
    const execution: ElementExecution = { elementId: 'foo', count: 2, failed: false };

    await actionDispatcher.dispatch(ExecutedFeedbackAction.create({ elementExecutions: [execution], oldElementExecutions: [], lastExecutedElementId: node.id }));
    expect(node.cssClasses).to.include('executed');
    expect(node.cssClasses).to.include('last');
    await actionDispatcher.dispatch(ExecutedFeedbackAction.create({ elementExecutions: [], oldElementExecutions: [execution], lastExecutedElementId: '' }));
    expect(node.cssClasses).to.not.include('executed');
  });

  it('Failed css class is set on element', async () => {
    const execution: ElementExecution = { elementId: 'foo', count: 2, failed: true };

    await actionDispatcher.dispatch(ExecutedFeedbackAction.create({ elementExecutions: [execution], oldElementExecutions: [], lastExecutedElementId: '' }));
    expect(node.cssClasses).to.include('failed');
    await actionDispatcher.dispatch(ExecutedFeedbackAction.create({ elementExecutions: [], oldElementExecutions: [execution], lastExecutedElementId: '' }));
    expect(node.cssClasses).to.not.include('failed');
  });
});
