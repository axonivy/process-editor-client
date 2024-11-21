import {
  Bounds,
  ChangeBoundsListener,
  ChangeBoundsTool,
  ResizeHandleLocation,
  SetBoundsFeedbackAction,
  TrackedResize
} from '@eclipse-glsp/client';
import { LaneNode } from '../diagram/model';

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
