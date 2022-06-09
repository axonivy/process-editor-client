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

import { CustomIconToggleActionHandler } from '../../src/diagram/icon/custom-icon-toggle-action-handler';
import ivyToolPaletteModule from '../../src/tool-bar/di.config';
import { ToolBarFeedbackAction, ToolBarFeedbackCommand } from '../../src/tool-bar/tool-bar-feedback';

let root: SModelRoot & SArgumentable;
let jumpOutBtn = false;
let customIconsBtn = false;

@injectable()
class ToolBarFeedbackCommandMock extends ToolBarFeedbackCommand {
  execute(context: CommandExecutionContext): CommandReturn {
    jumpOutBtn = this.showJumpOutBtn(root);
    customIconsBtn = this.showCustomIcons(root);
    return root;
  }
}

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule, defaultGLSPModule, glspSelectModule, modelSourceModule, glspMouseToolModule, ivyToolPaletteModule);
  container.bind(TYPES.ModelSource).to(LocalModelSource);
  container.bind(TYPES.IFeedbackActionDispatcher).to(FeedbackActionDispatcher).inSingletonScope();
  container.bind(CustomIconToggleActionHandler).toSelf().inSingletonScope();
  configureCommand(container, ToolBarFeedbackCommandMock);
  return container;
}

describe('ToolPaletteFeedback', () => {
  let actionDispatcher: ActionDispatcher;
  let customIconHandler: CustomIconToggleActionHandler;

  beforeEach(() => {
    const container = createContainer();
    const graphFactory = container.get<SModelFactory>(TYPES.IModelFactory);
    root = graphFactory.createRoot({ id: 'graph', type: 'graph' }) as SGraph & SArgumentable;
    root.args = {};
    customIconHandler = container.get<CustomIconToggleActionHandler>(CustomIconToggleActionHandler);
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(InitializeCanvasBoundsAction.create(Bounds.EMPTY));
  });

  it('jumpOutBtn is not shown on main process (contains no "-")', async () => {
    await actionDispatcher.dispatch(ToolBarFeedbackAction.create());
    expect(jumpOutBtn).to.be.false;
  });

  it('jumpOutBtn is shown on sub process (root pid contains "-")', async () => {
    root.id = 'graph-f1';
    await actionDispatcher.dispatch(ToolBarFeedbackAction.create());
    expect(jumpOutBtn).to.be.true;
  });

  it('customIconsBtn is active if root arg is set', async () => {
    await actionDispatcher.dispatch(ToolBarFeedbackAction.create());
    expect(customIconsBtn).to.be.true;

    customIconHandler.setShowCustomIcons = false;
    await actionDispatcher.dispatch(ToolBarFeedbackAction.create());
    expect(customIconsBtn).to.be.false;
  });
});
