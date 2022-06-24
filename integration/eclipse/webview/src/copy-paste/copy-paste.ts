import {
  Action,
  CutOperation,
  EditorContextService,
  IActionDispatcher,
  IActionHandler,
  IAsyncClipboardService,
  PasteOperation,
  RequestClipboardDataAction,
  TYPES,
  ViewerOptions
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

// Eclipse-specific integration: in Eclipse, we trigger the Copy/Paste actions from
// the IDE Keybindings. We don't use the browser events. This is fine, because we
// don't need browser clipboard support (We use the Eclipse System Clipboard); so
// we don't need special permission from the Browser.

@injectable()
export class IvyEclipseCopyPasteActionHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
  @inject(TYPES.ViewerOptions) protected viewerOptions: ViewerOptions;
  @inject(TYPES.IAsyncClipboardService) protected clipboadService: IAsyncClipboardService;
  @inject(EditorContextService) protected editorContext: EditorContextService;

  handle(action: Action): void {
    switch (action.kind) {
      case 'invoke-copy':
        this.handleCopy();
        break;
      case 'invoke-paste':
        this.handlePaste();
        break;
      case 'invoke-cut':
        this.handleCut();
        break;
    }
  }

  handleCopy(): void {
    if (this.shouldCopy()) {
      this.actionDispatcher.request(RequestClipboardDataAction.create(this.editorContext.get()));
    } else {
      this.clipboadService.clear();
    }
  }

  handleCut(): void {
    if (this.shouldCopy()) {
      this.handleCopy();
      this.actionDispatcher.dispatch(CutOperation.create(this.editorContext.get()));
    }
  }

  handlePaste(): void {
    // In the Eclipse Integration case, the server manages its own clipboard.
    // Just pass an empty clipboard data to remain compliant with the API.
    const clipboardData = {};
    this.actionDispatcher.dispatch(PasteOperation.create({ clipboardData: clipboardData, editorContext: this.editorContext.get() }));
  }

  protected shouldCopy(): boolean | null {
    return (
      this.editorContext.get().selectedElementIds.length > 0 &&
      document.activeElement instanceof SVGElement &&
      document.activeElement.parentElement &&
      document.activeElement.parentElement.id === this.viewerOptions.baseDiv
    );
  }
}
