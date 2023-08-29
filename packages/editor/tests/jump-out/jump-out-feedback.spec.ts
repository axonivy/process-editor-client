import {
  ActionDispatcher,
  CommandExecutionContext,
  CommandReturn,
  configureCommand,
  defaultGLSPModule,
  defaultModule,
  FeedbackActionDispatcher,
  glspSelectModule,
  InitializeCanvasBoundsAction,
  LocalModelSource,
  modelSourceModule,
  SArgumentable,
  SGraph,
  SModelFactory,
  SModelRoot,
  TYPES,
  glspMouseToolModule,
  Bounds
} from '@eclipse-glsp/client';
import { expect } from 'chai';
import { Container, injectable } from 'inversify';

import { JumpOutFeedbackAction, JumpOutFeedbackCommand } from '../../src/jump/jump-out-ui';

let root: SModelRoot & SArgumentable;
let jumpOutBtn = false;

@injectable()
class JumpOutFeedbackCommandMock extends JumpOutFeedbackCommand {
  execute(context: CommandExecutionContext): CommandReturn {
    jumpOutBtn = this.showJumpOutBtn(root);
    return root;
  }
}

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule, defaultGLSPModule, glspSelectModule, modelSourceModule, glspMouseToolModule);
  container.bind(TYPES.ModelSource).to(LocalModelSource);
  container.bind(TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  configureCommand(container, JumpOutFeedbackCommandMock);
  return container;
}

describe('ToolPaletteFeedback', () => {
  let actionDispatcher: ActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    const graphFactory = container.get<SModelFactory>(TYPES.IModelFactory);
    root = graphFactory.createRoot({ id: 'graph', type: 'graph' }) as SGraph & SArgumentable;
    root.args = {};
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(InitializeCanvasBoundsAction.create(Bounds.EMPTY));
  });

  it('jumpOutBtn is not shown on main process (contains no "-")', async () => {
    await actionDispatcher.dispatch(JumpOutFeedbackAction.create());
    expect(jumpOutBtn).to.be.false;
  });

  it('jumpOutBtn is shown on sub process (root pid contains "-")', async () => {
    root.id = 'graph-f1';
    await actionDispatcher.dispatch(JumpOutFeedbackAction.create());
    expect(jumpOutBtn).to.be.true;
  });
});
