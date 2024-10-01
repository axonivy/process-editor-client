/* eslint-disable no-unused-expressions */
import {
  Action,
  ActionDispatcher,
  ArgsAware,
  Bounds,
  GGraph,
  GModelFactory,
  GModelRoot,
  IActionHandler,
  ICommand,
  InitializeCanvasBoundsAction,
  TYPES,
  configureActionHandler,
  selectModule
} from '@eclipse-glsp/client';
import { Container, injectable } from 'inversify';
import { beforeEach, describe, expect, test } from 'vitest';

import { createTestContainer } from '../utils/test-utils';
import { JumpOutFeedbackAction, JumpOutUi } from './jump-out-ui';

let root: GModelRoot & ArgsAware;
let jumpOutBtn = false;

@injectable()
class JumpOutActionHandlerMock implements IActionHandler {
  handle(action: Action): ICommand | Action | void {
    const outUi = new JumpOutUi();
    jumpOutBtn = outUi.showJumpOutBtn(root);
  }
}

function createContainer(): Container {
  const container = createTestContainer(selectModule);
  configureActionHandler(container, JumpOutFeedbackAction.KIND, JumpOutActionHandlerMock);

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
