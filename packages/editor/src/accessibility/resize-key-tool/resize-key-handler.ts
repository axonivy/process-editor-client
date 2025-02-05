import {
  Action,
  getElements,
  isResizable,
  isSelectableAndBoundsAware,
  ResizeElementAction,
  ResizeElementHandler
} from '@eclipse-glsp/client';

export class IvyResizeElementHandler extends ResizeElementHandler {
  handle(action: Action) {
    if (ResizeElementAction.is(action) && action.elementIds.length === 1) {
      const elements = getElements(this.editorContextService.modelRoot.index, action.elementIds, isSelectableAndBoundsAware);
      if (elements.length === 1 && isResizable(elements[0])) {
        this.handleResizeElement(action);
      }
    }
  }
}
