import {
  Action,
  CenterAction,
  FitToScreenAction,
  GModelElement,
  isViewport,
  matchesKeystroke,
  OriginViewportAction,
  SetAccessibleKeyShortcutAction,
  SetUIExtensionVisibilityAction,
  SetViewportAction,
  ZoomElementAction,
  ZoomKeyListener,
  ZoomKeyTool,
  ZoomViewportAction
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { QuickActionUI } from '../ui-tools/quick-action/quick-action-ui';

@injectable()
export class IvyZoomKeyTool extends ZoomKeyTool {
  protected readonly zoomKeyListener: ZoomKeyListener = new IvyZoomKeyListener(this);

  getEditorContextService() {
    return this.editorContextService;
  }
}

@injectable()
class IvyZoomKeyListener extends ZoomKeyListener {
  constructor(protected tool: IvyZoomKeyTool) {
    super(tool);
  }

  registerShortcutKey(): void {
    this.tool.actionDispatcher.dispatchOnceModelInitialized(
      SetAccessibleKeyShortcutAction.create({
        token: this.token,
        keys: [
          { shortcuts: ['+'], description: 'Zoom in to element or viewport', group: 'Viewport', position: 0 },
          { shortcuts: ['-'], description: 'Zoom out to element or viewport', group: 'Viewport', position: 1 }
        ]
      })
    );
  }

  dispatch = (action: Action, setViewport = false) => {
    this.tool.actionDispatcher.dispatch(action).then(() => {
      const model = this.tool.getEditorContextService().modelRoot;
      if (!isViewport(model)) {
        return;
      }
      const visibilityAction = SetUIExtensionVisibilityAction.create({
        extensionId: QuickActionUI.ID,
        visible: true,
        contextElementsId: [...this.tool.selectionService.getSelectedElementIDs()]
      });
      this.tool.actionDispatcher.dispatchAll(
        setViewport ? [visibilityAction, SetViewportAction.create(model.id, model, {})] : [visibilityAction]
      );
    });
  };

  override keyDown(element: GModelElement, event: KeyboardEvent) {
    const selectedElementIds = this.tool.selectionService.getSelectedElementIDs();

    if (this.matchesZoomOutKeystroke(event)) {
      if (selectedElementIds.length > 0) {
        this.dispatch(ZoomElementAction.create(selectedElementIds, ZoomKeyListener.defaultZoomOutFactor));
      } else {
        this.dispatch(ZoomViewportAction.create(ZoomKeyListener.defaultZoomOutFactor));
      }
    } else if (this.matchesZoomInKeystroke(event)) {
      if (selectedElementIds.length > 0) {
        this.dispatch(ZoomElementAction.create(selectedElementIds, ZoomKeyListener.defaultZoomInFactor));
      } else {
        this.dispatch(ZoomViewportAction.create(ZoomKeyListener.defaultZoomInFactor));
      }
    } else if (matchesKeystroke(event, 'KeyC')) this.dispatch(CenterAction.create(selectedElementIds), true);
    else if (matchesKeystroke(event, 'KeyF')) this.dispatch(FitToScreenAction.create(selectedElementIds), true);
    else if (matchesKeystroke(event, 'KeyO')) this.dispatch(OriginViewportAction.create(), true);
    return [];
  }
}
