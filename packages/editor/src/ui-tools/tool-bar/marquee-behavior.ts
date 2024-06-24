import {
  Bounds,
  BoundsAwareModelElement,
  GLabel,
  GNode,
  MarqueeUtil,
  TypeGuard,
  isSelectableAndBoundsAware,
  toTypeGuard,
  typeGuard,
  typeGuardOr
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { EdgeLabel } from '../../diagram/model';

@injectable()
export class IvyMarqueeUtil extends MarqueeUtil {
  protected isMarkableNode(): TypeGuard<BoundsAwareModelElement> {
    // customization: also allow labels to be marked and selected
    return typeGuard(typeGuardOr(toTypeGuard(GNode), toTypeGuard(GLabel)), isSelectableAndBoundsAware);
  }

  protected getNodeBounds(element: BoundsAwareModelElement): Bounds {
    // the bounds of edge labels are not correctly calculated when calling toAbsoluteBounds
    return element instanceof EdgeLabel ? element.bounds : super.getNodeBounds(element);
  }
}
