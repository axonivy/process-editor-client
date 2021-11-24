import { inject } from 'inversify';
import { Action, Bounds, BoundsAwareViewportCommand, SModelRoot, TYPES, Viewport } from 'sprotty';

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
