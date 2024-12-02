import type { GModelElement, TrackedElementResize, TrackedResize } from '@eclipse-glsp/client';
import { Bounds, ChangeBoundsListener, ChangeBoundsTool, ResizeHandleLocation, SetBoundsFeedbackAction } from '@eclipse-glsp/client';
import { LaneNode } from '../diagram/model';
import { injectable } from 'inversify';
@injectable()
export class IvyChangeBoundsTool extends ChangeBoundsTool {
  protected override createChangeBoundsListener() {
    return new IvyChangeBoundsListener(this);
  }
}

export class IvyChangeBoundsListener extends ChangeBoundsListener {
  override mouseDown(target: GModelElement, event: MouseEvent) {
    if (this.activeResizeElement) {
      // We still have a resize element, so we don't need to reevaluate it.
      // This may happens because the mouse left the window.
      return [];
    }
    return super.mouseDown(target, event);
  }

  protected resizeBoundsAction(resize: TrackedResize) {
    const elementResizes = resize.elementResizes.filter(elementResize => elementResize.valid.size);
    if (this.isLaneMove(resize, elementResizes)) {
      this.changeLaneResizeToMove(elementResizes[0]);
    }
    return SetBoundsFeedbackAction.create(elementResizes.map(elementResize => this.toElementAndBounds(elementResize)));
  }

  private isLaneMove(resize: TrackedResize, elementResizes: Array<TrackedElementResize>) {
    return (
      elementResizes.length === 1 &&
      elementResizes[0].element instanceof LaneNode &&
      resize.handleMove.element.location === ResizeHandleLocation.Top
    );
  }

  private changeLaneResizeToMove(elementResize: TrackedElementResize) {
    elementResize.toBounds = { ...elementResize.fromBounds, ...Bounds.position(elementResize.toBounds) };
  }
}
