import { EditorContextService, GLSP_TYPES, GLSPActionDispatcher, isViewport } from '@eclipse-glsp/client';
import { SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { inject, injectable } from 'inversify';
import {
  AbstractUIExtension,
  Action,
  IActionHandler,
  ICommand,
  IToolManager,
  SetUIExtensionVisibilityAction,
  SetViewportAction,
  TYPES
} from 'sprotty';
import { CenterButton, FitToScreenButton, OriginScreenButton, ViewportBarButton } from './button';

import { createIcon } from '../tool-bar/tool-bar-helper';
import { QuickActionUI } from '../quick-action/quick-action-ui';

@injectable()
export class EnableViewportAction implements Action {
  static readonly KIND = 'enableViewport';
  readonly kind = EnableViewportAction.KIND;
}

@injectable()
export class ViewportBar extends AbstractUIExtension implements IActionHandler {
  static readonly ID = 'ivy-viewport-bar';

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;
  @inject(TYPES.IToolManager) protected readonly toolManager: IToolManager;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;
  @inject(GLSP_TYPES.SelectionService) protected selectionService: SelectionService;

  protected zoomLevel?: HTMLElement;

  id(): string {
    return ViewportBar.ID;
  }
  containerClass(): string {
    return ViewportBar.ID;
  }

  protected initializeContents(_containerElement: HTMLElement): void {
    this.createBar();
  }

  protected createBar(): void {
    const headerCompartment = document.createElement('div');
    headerCompartment.classList.add('bar-header');
    headerCompartment.appendChild(this.createViewportTools());
    this.containerElement.appendChild(headerCompartment);
  }

  private createViewportTools(): HTMLElement {
    const viewportTools = document.createElement('div');
    viewportTools.classList.add('header-tools');

    const originViewportButton = this.createViewportButton(new OriginScreenButton());
    viewportTools.appendChild(originViewportButton);

    const fitToScreenViewportButton = this.createViewportButton(new FitToScreenButton());
    viewportTools.appendChild(fitToScreenViewportButton);

    const centerViewportButton = this.createViewportButton(new CenterButton(() => [...this.selectionService.getSelectedElementIDs()]));
    viewportTools.appendChild(centerViewportButton);

    this.zoomLevel = document.createElement('label');
    this.zoomLevel.textContent = '100%';
    viewportTools.appendChild(this.zoomLevel);
    return viewportTools;
  }

  protected createViewportButton(toolButton: ViewportBarButton): HTMLElement {
    const button = createIcon([toolButton.icon, 'fa-xs']);
    button.id = toolButton.id;
    button.title = toolButton.title;
    button.onclick = () =>
      this.actionDispatcher.dispatch(toolButton.action()).then(() => {
        const model = this.editorContext.modelRoot;
        if (isViewport(model)) {
          this.updateZoomLevel(model.zoom);
          this.actionDispatcher.dispatch(
            new SetUIExtensionVisibilityAction(QuickActionUI.ID, true, [...this.selectionService.getSelectedElementIDs()])
          );
        }
      });
    return button;
  }

  handle(action: Action): ICommand | Action | void {
    if (action.kind === EnableViewportAction.KIND) {
      this.actionDispatcher.dispatch(new SetUIExtensionVisibilityAction(ViewportBar.ID, true));
    }
    if (isSetViewportAction(action)) {
      this.updateZoomLevel(action.newViewport.zoom);
    }
  }

  private updateZoomLevel(zoom: number): void {
    if (this.zoomLevel) {
      this.zoomLevel.textContent = (zoom * 100).toFixed(0).toString() + '%';
    }
  }
}

function isSetViewportAction(action: Action): action is SetViewportAction {
  return action !== undefined && action.kind === SetViewportAction.KIND && (action as SetViewportAction).newViewport !== undefined;
}
