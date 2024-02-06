import {
  Action,
  AddTemplateElementsAction,
  CSS_GHOST_ELEMENT,
  CSS_HIDDEN,
  CursorCSS,
  GModelElement,
  MouseTrackingElementPositionListener,
  NodeCreationTool,
  NodeCreationToolMouseListener,
  cursorFeedbackAction,
  getAbsolutePosition,
  getTemplateElementId
} from '@eclipse-glsp/client';
import { TriggerNodeCreationAction } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';
import { addNegativeArea } from './negative-area/model';

@injectable()
export class IvyNodeCreationTool extends NodeCreationTool {
  static ID = 'tool_create_node';

  protected ivyCreationToolMouseListener: NodeCreationToolMouseListener;

  override doEnable(): void {
    let trackingListener: MouseTrackingElementPositionListener | undefined;
    const ghostElement = this.triggerAction.ghostElement;
    if (ghostElement) {
      trackingListener = new MouseTrackingElementPositionListener(getTemplateElementId(ghostElement.template), this, 'middle');
      this.toDisposeOnDisable.push(
        this.registerFeedback(
          [AddTemplateElementsAction.create({ templates: [ghostElement.template], addClasses: [CSS_HIDDEN, CSS_GHOST_ELEMENT] })],
          ghostElement
        ),
        this.mouseTool.registerListener(trackingListener)
      );
    }
    this.ivyCreationToolMouseListener = new IvyNodeCreationToolMouseListener(this.triggerAction, this, trackingListener);
    this.toDisposeOnDisable.push(
      this.mouseTool.registerListener(this.ivyCreationToolMouseListener),
      this.registerFeedback([cursorFeedbackAction(CursorCSS.NODE_CREATION)], this, [cursorFeedbackAction()]),
      addNegativeArea(this.editorContext.modelRoot)
    );
  }
}

@injectable()
export class IvyNodeCreationToolMouseListener extends NodeCreationToolMouseListener {
  override mouseMove(target: GModelElement, event: MouseEvent): Action[] {
    const absolutePos = getAbsolutePosition(target, event);
    if (absolutePos.x < 0 || absolutePos.y < 0) {
      this.tool.registerFeedback([cursorFeedbackAction(CursorCSS.OPERATION_NOT_ALLOWED)]);
    } else {
      this.tool.registerFeedback([cursorFeedbackAction(CursorCSS.NODE_CREATION)]);
    }
    return super.mouseMove(target, event);
  }
}
