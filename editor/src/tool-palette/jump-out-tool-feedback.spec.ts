import {
  ActionDispatcher,
  CommandExecutionContext,
  CommandReturn,
  configureCommand,
  defaultGLSPModule,
  defaultModule,
  EMPTY_BOUNDS,
  FeedbackActionDispatcher,
  GLSP_TYPES,
  glspSelectModule,
  InitializeCanvasBoundsAction,
  LocalModelSource,
  modelSourceModule,
  TYPES
} from '@eclipse-glsp/client';
import { expect } from 'chai';
import { Container, injectable } from 'inversify';
import { describe, it } from 'mocha';

import ivyToolPaletteModule from '../tool-palette/di.config';
import { ShowJumpOutToolFeedbackAction, ShowJumpOutToolFeedbackCommand } from './jump-out-tool-feedback';

let feedbackActive = false;

@injectable()
class ShowJumpOutToolFeedbackCommandMock extends ShowJumpOutToolFeedbackCommand {
  execute(context: CommandExecutionContext): CommandReturn {
    const root = context.root;
    root.id = this.action.elementId ?? '';
    feedbackActive = this.showJumpOutBtn(root);
    return root;
  }
}

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule, defaultGLSPModule, glspSelectModule, modelSourceModule, ivyToolPaletteModule);
  container.bind(TYPES.ModelSource).to(LocalModelSource);
  container.bind(GLSP_TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  configureCommand(container, ShowJumpOutToolFeedbackCommandMock);
  return container;
}

describe('JumpOutTool', () => {
  let actionDispatcher: ActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(new InitializeCanvasBoundsAction(EMPTY_BOUNDS));
  });

  it('Is not shown on main process (contains no "-")', async () => {
    await actionDispatcher.dispatch(new ShowJumpOutToolFeedbackAction('foo'));
    expect(feedbackActive).to.be.false;
  });

  it('Is shown on root if root pid contains "-"', async () => {
    await actionDispatcher.dispatch(new ShowJumpOutToolFeedbackAction('foo-f1'));
    expect(feedbackActive).to.be.true;
  });
});
