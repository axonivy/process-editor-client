import {
  Action,
  Bounds,
  CursorCSS,
  DOMHelper,
  GLabel,
  GModelElement,
  GModelRoot,
  GNode,
  IMarqueeBehavior,
  MarqueeMouseListener,
  MarqueeMouseTool,
  SelectAction,
  TypeGuard,
  cursorFeedbackAction,
  getAbsolutePosition,
  getMatchingElements,
  isBoundsAware,
  isSelectableAndBoundsAware,
  toAbsoluteBounds,
  toTypeGuard,
  typeGuard
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { EdgeLabel } from '../../diagram/model';

@injectable()
export class IvyMarqueeMouseTool extends MarqueeMouseTool {
  override enable(): void {
    this.toDisposeOnDisable.push(
      this.mouseTool.registerListener(new IvyMarqueeMouseListener(this.domHelper, this.editorContext.modelRoot, this.marqueeBehavior)),
      this.keyTool.registerListener(this.shiftKeyListener),
      this.createFeedbackEmitter().add(cursorFeedbackAction(CursorCSS.MARQUEE), cursorFeedbackAction()).submit()
    );
  }
}

export class IvyMarqueeMouseListener extends MarqueeMouseListener {
  constructor(domHelper: DOMHelper, root: GModelRoot, marqueeBehavior: IMarqueeBehavior | undefined) {
    super(domHelper, root, marqueeBehavior);

    // customization: "nodes" does not have to be nodes but also can be edges
    this.nodes = getMatchingElements(
      root.index,
      typeGuard(typeGuardOr(toTypeGuard(GNode), toTypeGuard(GLabel)), isSelectableAndBoundsAware)
    );
  }

  override mouseMove(target: GModelElement, event: MouseEvent): Action[] {
    this.marqueeUtil.updateCurrentPoint(getAbsolutePosition(target, event));
    if (this.isActive) {
      // customization: use custom bounds method instead of toAbsoluteBounds to also catch edge labels
      const nodeIdsSelected = this.nodes.filter(e => this.marqueeUtil.isNodeMarked(this.getBounds(e))).map(e => e.id);
      const edgeIdsSelected = this.edges.filter(e => this.isEdgeMarked(e)).map(e => this.domHelper.findSModelIdByDOMElement(e));
      const selected = nodeIdsSelected.concat(edgeIdsSelected);
      return [SelectAction.setSelection(selected.concat(this.previouslySelected)), this.marqueeUtil.drawMarqueeAction()];
    }
    return [];
  }

  protected getBounds(element: GModelElement): Bounds {
    if (element instanceof EdgeLabel) {
      return element.bounds;
    }
    return isBoundsAware(element) ? toAbsoluteBounds(element) : Bounds.EMPTY;
  }
}

/** Utility function to combine two type guards */
export function typeGuardOr<T, G>(one: TypeGuard<T>, other: TypeGuard<G>): TypeGuard<T | G> {
  return (element: any): element is T | G => one(element) || other(element);
}
