import {
  Action,
  CursorCSS,
  cursorFeedbackAction,
  EdgeRouterRegistry,
  findParentByFeature,
  GLSP_TYPES,
  IActionDispatcher,
  IFeedbackActionDispatcher,
  IMovementRestrictor,
  isBoundsAwareMoveable,
  ISnapper,
  isSelected,
  MouseListener,
  SModelElement
} from '@eclipse-glsp/client';
import { SelectionListener, SelectionService } from '@eclipse-glsp/client/lib/features/select/selection-service';
import { BaseGLSPTool } from '@eclipse-glsp/client/lib/features/tools/base-glsp-tool';
import { inject, injectable, optional } from 'inversify';
import { ILogger, SModelRoot, TYPES } from 'sprotty';

import { QuickActionHandle } from './model';
import { HideQuickActionToolFeedbackAction, ShowQuickActionToolFeedbackAction } from './quick-action-tool-feedback';

@injectable()
export class QuickActionTool extends BaseGLSPTool {
  static ID = 'ivy.quick-action-tool';

  @inject(GLSP_TYPES.SelectionService) protected selectionService: SelectionService;
  @inject(EdgeRouterRegistry) @optional() readonly edgeRouterRegistry?: EdgeRouterRegistry;
  @inject(TYPES.ISnapper) @optional() readonly snapper?: ISnapper;
  @inject(GLSP_TYPES.IMovementRestrictor) @optional() readonly movementRestrictor?: IMovementRestrictor;
  protected quickActionListener: MouseListener & SelectionListener;

  get id(): string {
    return QuickActionTool.ID;
  }

  enable(): void {
    // install change bounds listener for client-side resize updates and server-side updates
    this.quickActionListener = this.createQuickActionListener();
    this.mouseTool.register(this.quickActionListener);
    this.selectionService.register(this.quickActionListener);
  }

  protected createQuickActionListener(): MouseListener & SelectionListener {
    return new QuickActionListener(this);
  }

  disable(): void {
    this.mouseTool.deregister(this.quickActionListener);
    this.selectionService.deregister(this.quickActionListener);
    this.deregisterFeedback([new HideQuickActionToolFeedbackAction], this.quickActionListener);
  }
}

@injectable()
export class QuickActionListener extends MouseListener implements SelectionListener {

  @inject(GLSP_TYPES.IFeedbackActionDispatcher) protected feedbackDispatcher: IFeedbackActionDispatcher;
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
  @inject(TYPES.ILogger) protected logger: ILogger;

  protected activeQuickActionElement?: SModelElement;
  protected activeQuickActionHandle?: QuickActionHandle;

  constructor(protected tool: QuickActionTool) {
    super();
  }

  mouseDown(target: SModelElement, event: MouseEvent): Action[] {
    super.mouseDown(target, event);
    if (event.button !== 0) {
      return [];
    }
    // check if we have a resize handle (only single-selection)
    if (this.activeQuickActionElement && target instanceof QuickActionHandle) {
      this.activeQuickActionHandle = target;
    } else {
      this.setActiveQuickActionElement(target);
    }
    return [];
  }

  mouseUp(target: SModelElement, event: MouseEvent): Action[] {
    super.mouseUp(target, event);
    if (this.activeQuickActionElement && target instanceof QuickActionHandle && this.activeQuickActionHandle) {
      return this.activeQuickActionHandle.mouseUp(this.activeQuickActionElement);
    }
    return [];
  }

  selectionChanged(root: SModelRoot, selectedElements: string[]): void {
    if (this.activeQuickActionElement) {
      if (selectedElements.includes(this.activeQuickActionElement.id)) {
        // our active element is still selected, nothing to do
        return;
      }

      // try to find some other selected element and mark that active
      for (const elementId of selectedElements.reverse()) {
        const element = root.index.getById(elementId);
        if (element && this.setActiveQuickActionElement(element)) {
          return;
        }
      }
      this.reset();
    }
  }

  protected setActiveQuickActionElement(target: SModelElement): boolean {
    // check if we have a selected, moveable element (multi-selection allowed)
    const moveableElement = findParentByFeature(target, isBoundsAwareMoveable);
    if (isSelected(moveableElement)) {
      // only allow one element to have the element resize handles
      this.activeQuickActionElement = moveableElement;
      this.tool.dispatchFeedback([new ShowQuickActionToolFeedbackAction(this.activeQuickActionElement.id)], this);
      return true;
    }
    return false;
  }

  protected reset(): void {
    if (this.activeQuickActionElement) {
      this.tool.dispatchFeedback([new HideQuickActionToolFeedbackAction()], this);
    }
    this.tool.dispatchActions([cursorFeedbackAction(CursorCSS.DEFAULT)]);
    this.resetPosition();
  }

  protected resetPosition(): void {
    this.activeQuickActionHandle = undefined;
  }
}
