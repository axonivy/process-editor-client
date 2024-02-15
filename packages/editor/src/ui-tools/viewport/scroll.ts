import {
  Action,
  EnableToolsAction,
  GLSPMouseTool,
  GLSPScrollMouseListener,
  GModelElement,
  ICommand,
  findParentByFeature,
  isCtrlOrCmd,
  isViewport
} from '@eclipse-glsp/client';
import { inject, injectable, postConstruct } from 'inversify';
import { IvyMarqueeMouseTool } from '../tool-bar/marquee-mouse-tool';

import { isLaneResizeHandle } from '../../lanes/model';
import { QuickActionUI } from '../quick-action/quick-action-ui';

@injectable()
export class IvyScrollMouseListener extends GLSPScrollMouseListener {
  @inject(QuickActionUI) quickActionUi: QuickActionUI;
  @inject(GLSPMouseTool) mouseTool: GLSPMouseTool;

  @postConstruct()
  protected init(): void {
    this.mouseTool.registerListener(this);
  }

  handle(action: Action): void | Action | ICommand {
    if (EnableToolsAction.is(action)) {
      if (action.toolIds.includes(IvyMarqueeMouseTool.ID)) {
        this.preventScrolling = true;
      }
    }
    super.handle(action);
  }

  mouseDown(target: GModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
    const lane = findParentByFeature(target, isLaneResizeHandle);
    if (lane) {
      return [];
    }
    const actions = super.mouseDown(target, event);
    if (this.lastScrollPosition) {
      this.quickActionUi.hideUi();
    }
    return actions;
  }

  mouseUp(target: GModelElement, event: MouseEvent): Action[] {
    if (this.lastScrollPosition) {
      this.quickActionUi.showUi();
    }
    return super.mouseUp(target, event);
  }

  wheel(target: GModelElement, event: WheelEvent): (Action | Promise<Action>)[] {
    if (isCtrlOrCmd(event)) {
      return [];
    }
    const viewport = findParentByFeature(target, isViewport);
    const scrollPos = { x: event.pageX, y: event.pageY };
    if (event.shiftKey) {
      scrollPos.x += event.deltaY !== 0 ? event.deltaY : event.deltaX;
    } else {
      scrollPos.x += event.deltaX;
      scrollPos.y += event.deltaY;
    }
    if (viewport) {
      return this.dragCanvas(viewport, event, scrollPos);
    }
    return [];
  }
}
