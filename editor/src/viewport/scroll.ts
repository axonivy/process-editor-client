import {
  Action,
  EnableToolsAction,
  findParentByFeature,
  GLSPScrollMouseListener,
  ICommand,
  isCtrlOrCmd,
  isViewport,
  SModelElement
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { IvyMarqueeMouseTool } from '../tool-bar/marquee-mouse-tool';

import { isLaneResizeHandle } from '../lanes/model';

@injectable()
export class IvyScrollMouseListener extends GLSPScrollMouseListener {
  handle(action: Action): void | Action | ICommand {
    if (EnableToolsAction.is(action)) {
      if (action.toolIds.includes(IvyMarqueeMouseTool.ID)) {
        this.preventScrolling = true;
      }
    }
    super.handle(action);
  }

  mouseDown(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
    const lane = findParentByFeature(target, isLaneResizeHandle);
    if (lane) {
      return [];
    }
    return super.mouseDown(target, event);
  }

  wheel(target: SModelElement, event: WheelEvent): (Action | Promise<Action>)[] {
    if (isCtrlOrCmd(event)) {
      return [];
    }
    const viewport = findParentByFeature(target, isViewport);
    const scrollPos = { x: event.pageX, y: event.pageY };
    if (event.shiftKey) {
      scrollPos.x += event.deltaY !== 0 ? event.deltaY : event.deltaX;
    } else {
      scrollPos.y += event.deltaY;
    }
    if (viewport) {
      return this.dragCanvas(viewport, event, scrollPos);
    }
    return [];
  }
}
