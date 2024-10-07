import { JumpAction } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import {
  Action,
  EditorContextService,
  GLSPAbstractUIExtension,
  GModelRoot,
  IActionDispatcher,
  IActionHandler,
  IFeedbackActionDispatcher,
  SelectionService,
  SetUIExtensionVisibilityAction,
  TYPES
} from '@eclipse-glsp/client';
import { inject, injectable, postConstruct } from 'inversify';
import { createElement, createIcon } from '../utils/ui-utils';

@injectable()
export class JumpOutUi extends GLSPAbstractUIExtension implements IActionHandler {
  static readonly ID = 'jumpOutUi';

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;
  @inject(TYPES.IFeedbackActionDispatcher) protected readonly feedbackDispatcher: IFeedbackActionDispatcher;
  @inject(SelectionService) protected selectionService: SelectionService;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;

  id(): string {
    return JumpOutUi.ID;
  }

  containerClass(): string {
    return 'jump-out-container';
  }

  protected initializeContents(containerElement: HTMLElement): void {
    containerElement.style.position = 'absolute';
  }

  protected onBeforeShow(containerElement: HTMLElement, root: Readonly<GModelRoot>, ...contextElementIds: string[]): void {
    containerElement.innerHTML = '';
    const button = createElement('div', ['jump-out-btn']);
    button.title = 'Jump out (J)';
    button.appendChild(createIcon(IvyIcons.JumpOut));
    button.onclick = _ev => this.actionDispatcher.dispatch(JumpAction.create({ elementId: '' }));
    containerElement.appendChild(button);
  }

  handle(action: Action): void {
    if (action.kind === JumpOutFeedbackAction.KIND) {
      this.feedbackDispatcher.registerFeedback(this, [
        SetUIExtensionVisibilityAction.create({ extensionId: JumpOutUi.ID, visible: this.showJumpOutBtn(this.editorContext.modelRoot) })
      ]);
    }
  }

  showJumpOutBtn(root: GModelRoot): boolean {
    return root.id.includes('-');
  }
}

export interface JumpOutFeedbackAction extends Action {
  kind: typeof JumpOutFeedbackAction.KIND;
  elementId?: string;
}

export namespace JumpOutFeedbackAction {
  export const KIND = 'jumpOutFeedback';

  export function create(elementId?: string): JumpOutFeedbackAction {
    return {
      kind: JumpOutFeedbackAction.KIND,
      elementId
    };
  }
}
