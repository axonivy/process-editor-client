import {
  Action,
  EditorContextService,
  GLSPActionDispatcher,
  hasStringProp,
  type IActionHandler,
  isViewport,
  SetViewportAction,
  SModelElement,
  TYPES,
  type Viewport
} from '@eclipse-glsp/client';
import { SelectAllAction } from '@eclipse-glsp/protocol';
import { injectable, inject } from 'inversify';
import type { KeyCode } from 'sprotty/lib/utils/keyboard';
import { StreamlineIcons } from '../StreamlineIcons';

import { type QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../ui-tools/quick-action/quick-action';
import { isJumpable } from './model';

export interface JumpAction extends Action {
  kind: typeof JumpAction.KIND;
  elementId: string;
}

export namespace JumpAction {
  export const KIND = 'jumpInto';

  export function create(options: { elementId: string }): JumpAction {
    return {
      kind: KIND,
      ...options
    };
  }

  export function is(object: any): object is JumpAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'elementId');
  }
}

export interface JumpOutViewportAction extends Action {
  kind: typeof JumpOutViewportAction.KIND;
  processId: string;
}

export namespace JumpOutViewportAction {
  export const KIND = 'jumpOutViewport';

  export function is(object: any): object is JumpOutViewportAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'processId');
  }
}

@injectable()
export class JumpActionHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;
  private static jumpStack: Array<Viewport> = [];

  handle(action: Action): Action | void {
    if (JumpAction.is(action)) {
      this.addViewportToStack(action);
      return SelectAllAction.create(false);
    }
    if (JumpOutViewportAction.is(action)) {
      this.updateViewportFromStack(action);
    }
  }

  addViewportToStack(action: JumpAction): void {
    if (action.elementId !== '') {
      const root = this.editorContext.modelRoot;
      if (isViewport(root)) {
        JumpActionHandler.jumpStack.push(root);
      }
    }
  }

  updateViewportFromStack(action: JumpOutViewportAction): void {
    const viewport = JumpActionHandler.jumpStack.pop();
    if (viewport) {
      this.actionDispatcher.dispatch(SetViewportAction.create(action.processId, viewport, { animate: false }));
    }
  }
}

@injectable()
export class JumpQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isJumpable(element)) {
      return new JumpQuickAction(element.id);
    }
    return undefined;
  }
}

class JumpQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = StreamlineIcons.Jump,
    public readonly title = 'Jump (J)',
    public readonly location = QuickActionLocation.Middle,
    public readonly sorting = 'A',
    public readonly action = JumpAction.create({ elementId: elementId }),
    public readonly readonlySupport = true,
    public readonly shortcut: KeyCode = 'KeyJ'
  ) {}
}
