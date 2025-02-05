import { Action, DOMHelper, EditorContextService, FocusDomAction, IActionHandler, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

@injectable()
export class FocusDomActionHandler implements IActionHandler {
  @inject(TYPES.DOMHelper)
  protected domHelper: DOMHelper;

  @inject(EditorContextService)
  protected editorContext: EditorContextService;

  handle(action: Action) {
    if (!FocusDomAction.is(action)) {
      return;
    }
    if (action.id === 'graph') {
      return this.focusBySelector(this.graphSelector);
    }
    this.focusBySelector(action.id);
  }

  get graphSelector(): string {
    const rootId = CSS.escape(this.domHelper.createUniqueDOMElementId(this.editorContext.modelRoot));
    return `#${rootId}`;
  }

  private focusBySelector(selector: string) {
    document.querySelector<HTMLElement>(selector)?.focus();
  }
}
