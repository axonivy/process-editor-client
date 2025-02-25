import {
  Action,
  AbstractUIExtension,
  EditorContextService,
  GLSPActionDispatcher,
  type IActionHandler,
  type ICommand,
  isViewport,
  type IToolManager,
  SetUIExtensionVisibilityAction,
  SetViewportAction,
  TYPES
} from '@eclipse-glsp/client';
import { SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { inject, injectable } from 'inversify';
import { CenterButton, FitToScreenButton, OriginScreenButton, type ViewportBarButton } from './button';

import { createElement, createIcon } from '../../utils/ui-utils';
import { QuickActionUI } from '../quick-action/quick-action-ui';
import { IvySetViewportZoomAction } from './viewport-commands';

export interface EnableViewportAction extends Action {
  kind: typeof EnableViewportAction.KIND;
}

export namespace EnableViewportAction {
  export const KIND = 'enableViewport';

  export function is(object: any): object is EnableViewportAction {
    return Action.hasKind(object, KIND);
  }

  export function create(): EnableViewportAction {
    return { kind: KIND };
  }
}

@injectable()
export class ViewportBar extends AbstractUIExtension implements IActionHandler {
  static readonly ID = 'ivy-viewport-bar';

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: GLSPActionDispatcher;
  @inject(TYPES.IToolManager) protected readonly toolManager: IToolManager;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;
  @inject(TYPES.SelectionService) protected selectionService: SelectionService;

  protected zoomLevel = '100%';
  protected zoomLevelElement?: HTMLElement;

  id(): string {
    return ViewportBar.ID;
  }
  containerClass(): string {
    return ViewportBar.ID;
  }

  protected initializeContents(containerElement: HTMLElement): void {
    this.createBar();
    containerElement.onwheel = ev => (ev.ctrlKey ? ev.preventDefault() : true);
  }

  protected createBar(): void {
    const headerCompartment = createElement('div', ['viewport-bar']);
    headerCompartment.appendChild(this.createViewportTools());
    this.containerElement.appendChild(headerCompartment);
  }

  private createViewportTools(): HTMLElement {
    const viewportTools = createElement('div', ['viewport-bar-tools']);

    viewportTools.appendChild(this.createViewportButton(new OriginScreenButton()));
    viewportTools.appendChild(this.createViewportButton(new FitToScreenButton()));
    viewportTools.appendChild(this.createViewportButton(new CenterButton(() => [...this.selectionService.getSelectedElementIDs()])));

    this.zoomLevelElement = document.createElement('label');
    this.zoomLevelElement.textContent = this.zoomLevel;
    viewportTools.appendChild(this.zoomLevelElement);
    return viewportTools;
  }

  protected createViewportButton(toolButton: ViewportBarButton): HTMLElement {
    const button = createElement('span');
    button.appendChild(createIcon(['si', `si-${toolButton.icon}`]));
    button.id = toolButton.id;
    button.title = toolButton.title;
    button.onclick = () =>
      this.actionDispatcher.dispatch(toolButton.action()).then(() => {
        const model = this.editorContext.modelRoot;
        if (isViewport(model)) {
          this.actionDispatcher.dispatchAll([
            SetUIExtensionVisibilityAction.create({
              extensionId: QuickActionUI.ID,
              visible: true,
              contextElementsId: [...this.selectionService.getSelectedElementIDs()]
            }),
            SetViewportAction.create(model.id, model, {})
          ]);
        }
      });
    return button;
  }

  handle(action: Action): ICommand | Action | void {
    if (EnableViewportAction.is(action)) {
      this.actionDispatcher.dispatch(SetUIExtensionVisibilityAction.create({ extensionId: ViewportBar.ID, visible: true }));
    }
    if (SetViewportAction.is(action)) {
      this.updateZoomLevel(action.newViewport.zoom);
    } else if (IvySetViewportZoomAction.is(action)) {
      this.updateZoomLevel(action.zoom);
    }
  }

  private updateZoomLevel(zoom: number): void {
    this.zoomLevel = (zoom * 100).toFixed(0).toString() + '%';
    if (this.zoomLevelElement) {
      this.zoomLevelElement.textContent = this.zoomLevel;
    }
  }
}
