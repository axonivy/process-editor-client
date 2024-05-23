import {
  Action,
  CommandExecutionContext,
  CommandReturn,
  EditorContextService,
  FeedbackCommand,
  IActionDispatcher,
  IFeedbackActionDispatcher,
  SetUIExtensionVisibilityAction,
  GModelRoot,
  TYPES,
  SelectionService,
  GLSPAbstractUIExtension
} from '@eclipse-glsp/client';
import { inject, injectable, postConstruct } from 'inversify';
import { IvyIcons } from '@axonivy/ui-icons';
import { createElement, createIcon } from '../utils/ui-utils';
import { JumpAction } from '@axonivy/process-editor-protocol';

@injectable()
export class JumpOutUi extends GLSPAbstractUIExtension {
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

  @postConstruct()
  protected postConstruct(): void {
    this.feedbackDispatcher.registerFeedback(this, [JumpOutFeedbackAction.create()]);
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
}

export interface JumpOutFeedbackAction extends Action {
  kind: typeof JumpOutFeedbackCommand.KIND;
  elementId?: string;
}

export namespace JumpOutFeedbackAction {
  export function create(elementId?: string): JumpOutFeedbackAction {
    return {
      kind: JumpOutFeedbackCommand.KIND,
      elementId
    };
  }
}

@injectable()
export class JumpOutFeedbackCommand extends FeedbackCommand {
  static readonly KIND = 'toolPaletteFeedback';
  @inject(TYPES.Action) protected action: JumpOutFeedbackAction;
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;

  execute(context: CommandExecutionContext): CommandReturn {
    this.actionDispatcher.dispatch(
      SetUIExtensionVisibilityAction.create({ extensionId: JumpOutUi.ID, visible: this.showJumpOutBtn(context.root) })
    );
    return context.root;
  }

  showJumpOutBtn(root: GModelRoot): boolean {
    return root.id.includes('-');
  }
}
