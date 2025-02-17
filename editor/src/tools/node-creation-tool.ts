import {
  Action,
  CursorCSS,
  cursorFeedbackAction,
  getAbsolutePosition,
  NodeCreationTool,
  NodeCreationToolMouseListener,
  SModelElement
} from '@eclipse-glsp/client';
import { TriggerNodeCreationAction } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';
import { addNegativeArea, removeNegativeArea } from './negative-area/model';

@injectable()
export class IvyNodeCreationTool extends NodeCreationTool {
  static ID = 'tool_create_node';

  protected ivyCreationToolMouseListener: NodeCreationToolMouseListener;

  enable(): void {
    if (this.triggerAction === undefined) {
      throw new TypeError(`Could not enable tool ${this.id}.The triggerAction cannot be undefined.`);
    }
    this.ivyCreationToolMouseListener = new IvyNodeCreationToolMouseListener(this.triggerAction, this);
    this.mouseTool.register(this.ivyCreationToolMouseListener);
    this.dispatchFeedback([cursorFeedbackAction(CursorCSS.NODE_CREATION)]);
    addNegativeArea(this.editorContext.modelRoot);
  }

  disable(): void {
    this.mouseTool.deregister(this.ivyCreationToolMouseListener);
    this.deregisterFeedback([cursorFeedbackAction()]);
    removeNegativeArea(this.editorContext.modelRoot);
  }
}

@injectable()
export class IvyNodeCreationToolMouseListener extends NodeCreationToolMouseListener {
  constructor(protected triggerAction: TriggerNodeCreationAction, protected tool: NodeCreationTool) {
    super(triggerAction, tool);
  }

  override mouseMove(target: SModelElement, event: MouseEvent): Action[] {
    const absolutePos = getAbsolutePosition(target, event);
    if (absolutePos.x < 0 || absolutePos.y < 0) {
      this.tool.dispatchFeedback([cursorFeedbackAction(CursorCSS.OPERATION_NOT_ALLOWED)]);
    } else {
      this.tool.dispatchFeedback([cursorFeedbackAction(CursorCSS.NODE_CREATION)]);
    }
    return super.mouseMove(target, event);
  }
}
