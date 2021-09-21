import {
  ActionDispatcher,
  CommandExecutionContext,
  CommandReturn,
  configureCommand,
  createFeatureSet,
  defaultModule,
  deletableFeature,
  EMPTY_BOUNDS,
  FeedbackActionDispatcher,
  GLSP_TYPES,
  InitializeCanvasBoundsAction,
  SChildElement,
  Selectable,
  selectFeature,
  SModelRoot,
  SNode,
  TYPES
} from '@eclipse-glsp/client';
import { expect } from 'chai';
import { Container, injectable } from 'inversify';
import { describe, it } from 'mocha';

import { jumpFeature } from '../jump/model';
import { QuickActionEdgeCreationTool } from './edge/edge-creation-tool';
import {
  DeleteQuickActionProvider,
  IVY_TYPES,
  JumpQuickActionProvider,
  quickActionFeature,
  QuickActionHandle
} from './model';
import {
  HideQuickActionToolFeedbackAction,
  HideQuickActionToolFeedbackCommand,
  ShowQuickActionToolFeedbackAction,
  ShowQuickActionToolFeedbackCommand
} from './quick-action-tool-feedback';

let root: SModelRoot;

@injectable()
class ShowQuickActionToolFeedbackCommandMock extends ShowQuickActionToolFeedbackCommand {
  execute(context: CommandExecutionContext): CommandReturn {
    root.id = this.action.elementId ?? '';
    context.root = root;
    return super.execute(context);
  }
}

@injectable()
class HideQuickActionToolFeedbackCommandMock extends HideQuickActionToolFeedbackCommand {
  execute(context: CommandExecutionContext): CommandReturn {
    context.root = root;
    return super.execute(context);
  }
}

class QuickActionAwareNode extends SNode implements Selectable {
  features = createFeatureSet([quickActionFeature, selectFeature, deletableFeature]);
}

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule);
  container.bind(GLSP_TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  container.bind(QuickActionEdgeCreationTool).toSelf().inSingletonScope();
  configureCommand(container, ShowQuickActionToolFeedbackCommandMock);
  configureCommand(container, HideQuickActionToolFeedbackCommandMock);

  container.bind(IVY_TYPES.QuickActionProvider).to(DeleteQuickActionProvider);
  container.bind(IVY_TYPES.QuickActionProvider).to(JumpQuickActionProvider);
  return container;
}

describe('QuickActionToolFeedback', () => {
  let actionDispatcher: ActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(new InitializeCanvasBoundsAction(EMPTY_BOUNDS));
    root = new SModelRoot();
  });

  it('Is not shown on not quick action aware element', async () => {
    const node = new SChildElement();
    node.id = 'noQuickActions';
    root.add(node);

    await actionDispatcher.dispatch(new ShowQuickActionToolFeedbackAction('noQuickActions'));
    expect(node.children).to.be.empty;
  });

  it('Is shown on quick action aware elment', async () => {
    const node = new QuickActionAwareNode();
    node.id = 'quickActions';
    root.add(node);

    await actionDispatcher.dispatch(new ShowQuickActionToolFeedbackAction('quickActions'));
    expect(node.children).to.have.lengthOf(1);
    expect(node.children[0]).to.be.instanceOf(QuickActionHandle);

    await actionDispatcher.dispatch(new HideQuickActionToolFeedbackAction());
    expect(node.children).to.be.empty;
  });

  it('Is shown with additional jump into sub action on sub elment', async () => {
    const node = new QuickActionAwareNode();
    node.id = 'sub';
    node.features = createFeatureSet([quickActionFeature, jumpFeature, selectFeature]);
    root.add(node);

    await actionDispatcher.dispatch(new ShowQuickActionToolFeedbackAction('sub'));
    expect(node.children).to.have.lengthOf(1);
    expect(node.children[0]).to.be.instanceOf(QuickActionHandle);

    await actionDispatcher.dispatch(new HideQuickActionToolFeedbackAction());
    expect(node.children).to.be.empty;
  });
});
