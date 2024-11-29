import type { TrackedResize } from '@eclipse-glsp/client';
import { Bounds, ChangeBoundsListener, ChangeBoundsTool, ResizeHandleLocation, SetBoundsFeedbackAction } from '@eclipse-glsp/client';
import { LaneNode } from '../diagram/model';
import { injectable } from 'inversify';
@injectable()
export class IvyChangeBoundsTool extends ChangeBoundsTool {
  protected createChangeBoundsListener() {
    return new IvyChangeBoundsListener(this);
  }
}

export class IvyChangeBoundsListener extends ChangeBoundsListener {
  protected resizeBoundsAction(resize: TrackedResize) {
    const elementResizes = resize.elementResizes.filter(elementResize => elementResize.valid.size);
    if (
      elementResizes.length === 1 &&
      elementResizes[0].element instanceof LaneNode &&
      resize.handleMove.element.location === ResizeHandleLocation.Top
    ) {
      const elementResize = elementResizes[0];
      elementResize.toBounds = { ...elementResize.fromBounds, ...Bounds.position(elementResize.toBounds) };
    }
    return SetBoundsFeedbackAction.create(elementResizes.map(elementResize => this.toElementAndBounds(elementResize)));
  }
}
