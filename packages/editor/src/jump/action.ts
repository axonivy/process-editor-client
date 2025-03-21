import {
  Action,
  type IActionHandler,
  GModelElement,
  EditorContextService,
  isViewport,
  type Viewport,
  TYPES,
  SetViewportAction,
  type IActionDispatcher
} from '@eclipse-glsp/client';
import { SelectAllAction } from '@eclipse-glsp/protocol';
import { injectable, inject } from 'inversify';
import { IvyIcons } from '@axonivy/ui-icons';

import { type QuickAction, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { isJumpable } from './model';
import { JumpAction } from '@axonivy/process-editor-protocol';
import { t } from 'i18next';

@injectable()
export class JumpActionHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;
  private jumpStack: Map<string, Viewport> = new Map();

  handle(action: Action) {
    if (JumpAction.is(action) && !action.noViewportUpdate) {
      this.updateViewport(action);
      return SelectAllAction.create(false);
    }
    return;
  }

  updateViewport(action: JumpAction) {
    const root = this.editorContext.modelRoot;
    if (action.elementId === '') {
      const viewport = this.jumpStack.get(root.id.substring(0, root.id.lastIndexOf('-')));
      if (viewport) {
        this.actionDispatcher.dispatch(SetViewportAction.create(root.id, viewport, { animate: false }));
      }
    } else {
      if (isViewport(root)) {
        this.jumpStack.set(this.editorContext.modelRoot.id, root);
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
        title: t('quickAction.jump', { hotkey: 'J' }),
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
