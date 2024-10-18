import { JumpAction } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import {
  Action,
  EditorContextService,
  GLSPAbstractUIExtension,
  GModelRoot,
  IActionDispatcher,
  IActionHandler,
  SelectionService,
  SetModelAction,
  SetUIExtensionVisibilityAction,
  TYPES,
  UpdateModelAction
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { createElement, createIcon } from '../utils/ui-utils';

@injectable()
export class JumpOutUi extends GLSPAbstractUIExtension implements IActionHandler {
  static readonly ID = 'jumpOutUi';

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;
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
    const button = createElement('button', ['jump-out-btn']);
    button.title = 'Jump out (J)';
    button.appendChild(createIcon(IvyIcons.JumpOut));
    button.onclick = _ev => this.actionDispatcher.dispatch(JumpAction.create({ elementId: '' }));
    containerElement.appendChild(button);
  }

  handle(action: Action): void {
    if (SetModelAction.is(action) || UpdateModelAction.is(action)) {
      this.actionDispatcher.dispatch(
        SetUIExtensionVisibilityAction.create({ extensionId: JumpOutUi.ID, visible: this.showJumpOutBtn(action.newRoot.id) })
      );
    }
  }

  showJumpOutBtn(id: string): boolean {
    return id.includes('-');
  }
}
