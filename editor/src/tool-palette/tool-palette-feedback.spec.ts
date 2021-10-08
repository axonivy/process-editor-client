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
  SArgumentable,
  SGraph,
  SModelFactory,
  SModelRoot,
  TYPES
} from '@eclipse-glsp/client';
import { expect } from 'chai';
import { Container, injectable } from 'inversify';
import { describe, it } from 'mocha';

import ivyToolPaletteModule from './di.config';
import { ToolPaletteFeedbackAction, ToolPaletteFeedbackCommand } from './tool-palette-feedback';

let root: SModelRoot & SArgumentable;
let jumpOutBtn = false;
let customIconsBtn = false;

@injectable()
class ToolPaletteFeedbackCommandMock extends ToolPaletteFeedbackCommand {
  execute(context: CommandExecutionContext): CommandReturn {
    jumpOutBtn = this.showJumpOutBtn(root);
    customIconsBtn = this.showCustomIcons(root);
    return root;
  }
}

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule, defaultGLSPModule, glspSelectModule, modelSourceModule, ivyToolPaletteModule);
  container.bind(TYPES.ModelSource).to(LocalModelSource);
  container.bind(GLSP_TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  configureCommand(container, ToolPaletteFeedbackCommandMock);
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
    actionDispatcher.dispatch(new InitializeCanvasBoundsAction(EMPTY_BOUNDS));
  });

  it('jumpOutBtn is not shown on main process (contains no "-")', async () => {
    await actionDispatcher.dispatch(new ToolPaletteFeedbackAction());
    expect(jumpOutBtn).to.be.false;
  });

  it('jumpOutBtn is shown on sub process (root pid contains "-")', async () => {
    root.id = 'graph-f1';
    await actionDispatcher.dispatch(new ToolPaletteFeedbackAction());
    expect(jumpOutBtn).to.be.true;
  });

  it('customIconsBtn is active if root arg is set', async () => {
    await actionDispatcher.dispatch(new ToolPaletteFeedbackAction());
    expect(customIconsBtn).to.be.true;

    root.args['customIcons'] = false;
    await actionDispatcher.dispatch(new ToolPaletteFeedbackAction());
    expect(customIconsBtn).to.be.false;
  });
});
