import {
  Action,
  IActionHandler,
  GModelElement,
  EditorContextService,
  isViewport,
  Viewport,
  TYPES,
  GLSPActionDispatcher,
  SetViewportAction
} from '@eclipse-glsp/client';
import { SelectAllAction } from '@eclipse-glsp/protocol';
import { injectable, inject } from 'inversify';
import { IvyIcons } from '@axonivy/editor-icons/lib';

import { QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { isJumpable } from './model';
import { JumpAction } from '@axonivy/process-editor-protocol';

@injectable()
export class JumpActionHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;
  private jumpStack: Array<Viewport> = [];

  handle(action: Action): Action | void {
    if (JumpAction.is(action)) {
      this.updateViewport(action);
      return SelectAllAction.create(false);
    }
  }

  updateViewport(action: JumpAction) {
    const root = this.editorContext.modelRoot;
    if (action.elementId === '') {
      const viewport = this.jumpStack.pop();
      if (viewport) {
        this.actionDispatcher.dispatch(SetViewportAction.create(root.id, viewport, { animate: false }));
      }
    } else {
      if (isViewport(root)) {
        this.jumpStack.push(root);
      }
    }
  }
}

@injectable()
export class JumpQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (isJumpable(element)) {
      return {
        icon: IvyIcons.SubStart,
        title: 'Jump (J)',
        location: 'Middle',
        sorting: 'A',
        action: JumpAction.create({ elementId: element.id }),
        readonlySupport: true,
        shortcut: 'KeyJ'
      };
    }
    return undefined;
  }
}
