import {
  Action,
  AddTemplateElementsAction,
  CSS_GHOST_ELEMENT,
  CSS_HIDDEN,
  CursorCSS,
  GModelElement,
  GNode,
  Locateable,
  ModifyCSSFeedbackAction,
  MouseTrackingElementPositionListener,
  MoveAction,
  NodeCreationTool,
  NodeCreationToolMouseListener,
  Point,
  TriggerNodeCreationAction,
  cursorFeedbackAction,
  getAbsolutePosition,
  getTemplateElementId,
  isBoundsAware,
  isMoveable,
  useSnap
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { addNegativeArea } from './negative-area/model';

@injectable()
export class IvyNodeCreationTool extends NodeCreationTool {
  static ID = 'tool_create_node';

  protected ivyCreationToolMouseListener: NodeCreationToolMouseListener;

  override doEnable(): void {
    let trackingListener: IvyMouseTrackingElementPositionListener | undefined;
    const ghostElement = this.triggerAction.ghostElement;
    if (ghostElement) {
      trackingListener = new IvyMouseTrackingElementPositionListener(getTemplateElementId(ghostElement.template), this, 'middle');
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
  constructor(
    triggerAction: TriggerNodeCreationAction,
    tool: NodeCreationTool,
    protected trackingListener?: IvyMouseTrackingElementPositionListener
  ) {
    super(triggerAction, tool, trackingListener);
  }

  override mouseMove(target: GModelElement, event: MouseEvent): Action[] {
    const absolutePos = getAbsolutePosition(target, event);
    if (absolutePos.x < 0 || absolutePos.y < 0) {
      this.tool.registerFeedback([cursorFeedbackAction(CursorCSS.OPERATION_NOT_ALLOWED)]);
    } else {
      this.tool.registerFeedback([cursorFeedbackAction(CursorCSS.NODE_CREATION)]);
    }
    return super.mouseMove(target, event);
  }

  protected getInsertPosition(target: GModelElement, event: MouseEvent): Point {
    if (this.trackingListener?.insertPosition) {
      return this.trackingListener.insertPosition;
    }
    return super.getInsertPosition(target, event);
  }
}

export class IvyMouseTrackingElementPositionListener extends MouseTrackingElementPositionListener {
  insertPosition?: Point;

  mouseMove(target: GModelElement, event: MouseEvent): Action[] {
    if (this._isMouseDown) {
      this._isMouseDrag = true;
    }
    const element = target.root.index.getById(this.elementId);
    if (!element || !isMoveable(element)) {
      return [];
    }
    const mousePosition = getAbsolutePosition(target, event);
    if (this.positionUpdater.isLastDragPositionUndefined()) {
      this.positionUpdater.updateLastDragPosition(element.position);
    }
    const delta = this.positionUpdater.updatePosition(element, mousePosition, useSnap(event));
    if (!delta) {
      return [];
    }
    const gridPosition = this.getMousePositionOnGrid(mousePosition, event);
    let targetPosition = this.getElementTargetPosition(gridPosition, element);
    targetPosition = this.validateMove(this.currentPosition ?? targetPosition, targetPosition, element, false);
    const moveGhostElement = MoveAction.create(
      [
        {
          elementId: element.id,
          fromPosition: this.currentPosition,
          toPosition: targetPosition
        }
      ],
      { animate: false, finished: false }
    );
    this.currentPosition = targetPosition;
    this.insertPosition = gridPosition;
    this.tool.registerFeedback([moveGhostElement], this);
    return element.cssClasses?.includes(CSS_HIDDEN)
      ? [ModifyCSSFeedbackAction.create({ elements: [element.id], remove: [CSS_HIDDEN] })]
      : [];
  }

  protected getMousePositionOnGrid(location: Point, event: MouseEvent): Point {
    // Create a 0-bounds proxy element for snapping
    const elementProxy = new GNode();
    elementProxy.size = { width: 0, height: 0 };
    return this.tool.positionSnapper.snapPosition(location, elementProxy);
  }

  protected getElementTargetPosition(gridPosition: Point, element: GModelElement & Locateable): Point {
    if (this.cursorPosition === 'middle' && isBoundsAware(element)) {
      return Point.subtract(gridPosition, { x: element.bounds.width / 2, y: element.bounds.height / 2 });
    }
    return gridPosition;
  }
}
