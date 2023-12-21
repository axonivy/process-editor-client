import {
  Bounds,
  Command,
  CommandExecutionContext,
  CommandReturn,
  BoundsAwareViewportCommand,
  Dimension,
  isViewport,
  Point,
  SModelRoot,
  TYPES,
  Viewport
} from '@eclipse-glsp/client';
import { inject } from 'inversify';
import { MoveIntoViewportAction, OriginViewportAction, SetViewportZoomAction } from '@axonivy/process-editor-protocol';

export class OriginViewportCommand extends BoundsAwareViewportCommand {
  static readonly KIND = OriginViewportAction.KIND;

  constructor(@inject(TYPES.Action) protected action: OriginViewportAction) {
    super(action.animate);
  }

  getElementIds(): string[] {
    return [];
  }

  getNewViewport(bounds: Bounds, model: SModelRoot): Viewport | undefined {
    return { zoom: 1, scroll: { x: 0, y: 0 } };
  }
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
    if (!Dimension.isValid(model.canvasBounds)) {
      return undefined;
    }
    return moveIntoViewport(
      model.canvasBounds,
      isViewport(model) ? model.scroll : Point.ORIGIN,
      Bounds.center(bounds),
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

export class IvySetViewportZoomCommand extends Command {
  static readonly KIND = SetViewportZoomAction.KIND;

  constructor(@inject(TYPES.Action) protected readonly action: SetViewportZoomAction) {
    super();
  }

  execute(context: CommandExecutionContext): CommandReturn {
    const model = context.root;
    if (isViewport(model)) {
      model.zoom = this.action.zoom;
    }
    return model;
  }

  undo(context: CommandExecutionContext): CommandReturn {
    context.logger.error(this, 'Cannot undo a ivy viewport zoom command');
    return context.root;
  }
  redo(context: CommandExecutionContext): CommandReturn {
    context.logger.error(this, 'Cannot redo a ivy viewport zoom command');
    return context.root;
  }
}
