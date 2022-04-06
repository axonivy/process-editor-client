import { center, FitToScreenAction, FitToScreenCommand, isBoundsAware, ORIGIN_POINT, Point } from '@eclipse-glsp/client';
import { inject } from 'inversify';
import { Action, Bounds, BoundsAwareViewportCommand, combine, isValidDimension, isViewport, SModelRoot, TYPES, Viewport } from 'sprotty';

export class OriginViewportAction implements Action {
  static readonly KIND = 'originViewport';
  readonly kind = OriginViewportAction.KIND;

  constructor(public readonly animate: boolean = true) {}
}

export class OriginViewportCommand extends BoundsAwareViewportCommand {
  static readonly KIND = OriginViewportAction.KIND;

  constructor(@inject(TYPES.Action) protected action: OriginViewportAction) {
    super(action.animate);
  }

  getElementIds(): string[] {
    return [];
  }

  getNewViewport(bounds: Bounds, model: SModelRoot): Viewport | undefined {
    return { zoom: 1, scroll: { x: 0, y: -50 } };
  }
}

export class IvyFitToScreenCommand extends FitToScreenCommand {
  static readonly KIND = FitToScreenAction.KIND;

  constructor(@inject(TYPES.Action) protected readonly action: FitToScreenAction) {
    super(action);
  }

  protected initialize(model: SModelRoot): void {
    if (isViewport(model)) {
      this.oldViewport = {
        scroll: model.scroll,
        zoom: model.zoom
      };
      const allBounds: Bounds[] = [];
      if (allBounds.length === 0) {
        model.index.all().forEach(element => {
          if (isBoundsAware(element)) {
            allBounds.push(this.boundsInViewport(element, element.bounds, model));
          }
        });
      }
      if (allBounds.length !== 0) {
        const bounds = allBounds.reduce((b0, b1) => combine(b0, b1));
        if (isValidDimension(bounds)) {
          this.newViewport = this.getNewViewport(bounds, model);
        }
      }
    }
  }
}

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
