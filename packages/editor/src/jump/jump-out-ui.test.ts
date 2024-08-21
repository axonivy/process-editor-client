/* eslint-disable no-unused-expressions */
import {
  ActionDispatcher,
  ArgsAware,
  Bounds,
  CommandExecutionContext,
  CommandReturn,
  GGraph,
  GModelFactory,
  GModelRoot,
  InitializeCanvasBoundsAction,
  TYPES,
  configureCommand,
  selectModule
} from '@eclipse-glsp/client';
import { Container, injectable } from 'inversify';
import { beforeEach, describe, expect, test } from 'vitest';

import { createTestContainer } from '../utils/test-utils';
import { JumpOutFeedbackAction, JumpOutFeedbackCommand } from './jump-out-ui';

let root: GModelRoot & ArgsAware;
let jumpOutBtn = false;

@injectable()
class JumpOutFeedbackCommandMock extends JumpOutFeedbackCommand {
  execute(context: CommandExecutionContext): CommandReturn {
    jumpOutBtn = this.showJumpOutBtn(root);
    return root;
  }
}

function createContainer(): Container {
  const container = createTestContainer(selectModule);
  configureCommand(container, JumpOutFeedbackCommandMock);

  return container;
}

describe('ToolPaletteFeedback', () => {
  let actionDispatcher: ActionDispatcher;

  beforeEach(() => {
    const container = createContainer();
    const graphFactory = container.get<GModelFactory>(TYPES.IModelFactory);
    root = graphFactory.createRoot({ id: 'graph', type: 'graph' }) as GGraph & ArgsAware;
    root.args = {};
    actionDispatcher = container.get<ActionDispatcher>(TYPES.IActionDispatcher);
    actionDispatcher.dispatch(InitializeCanvasBoundsAction.create(Bounds.EMPTY));
  });

  test('hidden on main process (contains no "-")', async () => {
    await actionDispatcher.dispatch(JumpOutFeedbackAction.create());
    expect(jumpOutBtn).toBeFalsy();
  });

  test('shown on sub process (root pid contains "-")', async () => {
    root.id = 'graph-f1';
    await actionDispatcher.dispatch(JumpOutFeedbackAction.create());
    expect(jumpOutBtn).toBeTruthy();
  });
});
