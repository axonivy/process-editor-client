import { findParentByFeature, GLSPScrollMouseListener, ICommand, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { Action, EnableToolsAction } from 'sprotty';
import { IvyMarqueeMouseTool } from '../tool-palette/marquee-mouse-tool';

import { isLaneResizeHandle } from '../lanes/model';

@injectable()
export class IvyScrollMouseListener extends GLSPScrollMouseListener {
  handle(action: Action): void | Action | ICommand {
    if (action instanceof EnableToolsAction) {
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
}
