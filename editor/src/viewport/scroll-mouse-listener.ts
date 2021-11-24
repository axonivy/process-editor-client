import { findParentByFeature, GLSPScrollMouseListener, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { Action } from 'sprotty';

import { isLaneResizeHandle } from '../lanes/model';

@injectable()
export class IvyScrollMouseListener extends GLSPScrollMouseListener {
  mouseDown(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[] {
    const lane = findParentByFeature(target, isLaneResizeHandle);
    if (lane) {
      return [];
    }
    return super.mouseDown(target, event);
  }
}
