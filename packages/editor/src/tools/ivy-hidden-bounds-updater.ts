import {
  Action,
  BoundsAware,
  BoundsAwareModelElement,
  BoundsData,
  CSS_GHOST_ELEMENT,
  GLSPHiddenBoundsUpdater,
  GModelElement,
  LocalRequestBoundsAction,
  hasArgs
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyHiddenBoundsUpdater extends GLSPHiddenBoundsUpdater {
  postUpdate(cause?: Action | undefined): void {
    if (LocalRequestBoundsAction.is(cause)) {
      // ensure we only actually change the bounds of the elements we are interested in
      Array.from(this.getElement2BoundsData().keys())
        .filter(element => !this.isElementToUpdate(element))
        .forEach(unnecessary => this.getElement2BoundsData().delete(unnecessary));
    }
    const elementsToUpdate = new Map(this.getElement2BoundsData());
    try {
      super.postUpdate(cause);
    } finally {
      Array.from(elementsToUpdate.keys()).forEach(element => this.cleanUpElement(element));
      elementsToUpdate.clear();
    }
  }

  protected isElementToUpdate(element: BoundsAwareModelElement): boolean {
    // ghost element or local set bounds element
    return !!element.cssClasses?.includes(CSS_GHOST_ELEMENT);
  }

  protected cleanUpElement(element: BoundsAwareModelElement): void {
    if (hasArgs(element) && element.args.requestBounds === true) {
      delete element.args.requestBounds;
    }
  }

  protected getElement2BoundsData(): Map<GModelElement & BoundsAware, BoundsData> {
    return this['element2boundsData'];
  }
}
