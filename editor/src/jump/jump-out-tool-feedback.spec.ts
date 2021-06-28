import {
  ActionDispatcher,
  CommandExecutionContext,
  CommandReturn,
  configureCommand,
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

import {
  HideJumpOutToolFeedbackAction,
  HideJumpOutToolFeedbackCommand,
  ShowJumpOutToolFeedbackAction,
  ShowJumpOutToolFeedbackCommand
} from './jump-out-tool-feedback';
import { SJumpOutHandle } from './model';

let root: SModelRoot;

@injectable()
class ShowJumpOutToolFeedbackCommandMock extends ShowJumpOutToolFeedbackCommand {
  execute(context: CommandExecutionContext): CommandReturn {
    root.id = this.action.elementId ?? '';
    context.root = root;
    return super.execute(context);
  }
}

@injectable()
class HideJumpOutToolFeedbackCommandMock extends HideJumpOutToolFeedbackCommand {
  execute(context: CommandExecutionContext): CommandReturn {
    context.root = root;
    return super.execute(context);
  }
}

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule);
  container.bind(GLSP_TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  configureCommand(container, ShowJumpOutToolFeedbackCommandMock);
  configureCommand(container, HideJumpOutToolFeedbackCommandMock);
  return container;
}

describe('Jump out tool', () => {
  let actionDispatcher: ActionDispatcher;
  let node: SChildElement;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(new InitializeCanvasBoundsAction(EMPTY_BOUNDS));
    root = new SModelRoot();
    node = new SChildElement();
    root.add(node);
  });

  it('Is not shown on main process (contains no "-")', async () => {
    await actionDispatcher.dispatch(new ShowJumpOutToolFeedbackAction('foo'));
    expect(root.children).to.have.lengthOf(1).and.include(node);
  });

  it('Is shown on root if root pid contains "-"', async () => {
    await actionDispatcher.dispatch(new ShowJumpOutToolFeedbackAction('foo-f1'));
    expect(root.children).to.have.lengthOf(2);
    expect(root.children[1]).to.be.an.instanceOf(SJumpOutHandle);

    await actionDispatcher.dispatch(new HideJumpOutToolFeedbackAction());
    expect(root.children).to.have.lengthOf(1).and.include(node);
  });
});
