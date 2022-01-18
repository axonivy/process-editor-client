import { ORIGIN_POINT, Point } from '@eclipse-glsp/protocol';
import { inject } from 'inversify';
import { Action, Bounds, BoundsAwareViewportCommand, center, isValidDimension, isViewport, SModelRoot, TYPES, Viewport } from 'sprotty';

export class MoveIntoViewportAction implements Action {
  static readonly KIND = 'moveIntoViewport';
  readonly kind = MoveIntoViewportAction.KIND;

  constructor(public readonly elementIds: string[], public readonly animate: boolean = true, public readonly retainZoom: boolean = false) {}
}

export class MoveIntoViewportCommand extends BoundsAwareViewportCommand {
  static readonly KIND = MoveIntoViewportAction.KIND;

  constructor(@inject(TYPES.Action) protected action: MoveIntoViewportAction) {
    super(action.animate);
  }

  getElementIds(): string[] {
    return this.action.elementIds;
  }

  getNewViewport(bounds: Bounds, model: SModelRoot): Viewport | undefined {
    if (!isValidDimension(model.canvasBounds)) {
      return undefined;
    }
    return moveIntoViewport(
      model.canvasBounds,
      isViewport(model) ? model.scroll : ORIGIN_POINT,
      center(bounds),
      this.action.retainZoom && isViewport(model) ? model.zoom : 1
    );
  }
}

export function moveIntoViewport(viewPort: Bounds, currentScrollPos: Point, elementPos: Point, zoom: number): Viewport {
  return {
    scroll: {
      x: calculateScroll(viewPort.width, currentScrollPos.x, elementPos.x, zoom),
      y: calculateScroll(viewPort.height, currentScrollPos.y, elementPos.y, zoom)
    },
    zoom: zoom
  };
}

function calculateScroll(viewPort: number, currentScrollPos: number, elementPos: number, zoom: number): number {
  const effectivePos = elementPos - currentScrollPos;
  return effectivePos > viewPort || effectivePos < 0 ? elementPos - (0.5 * viewPort) / zoom : currentScrollPos;
}
