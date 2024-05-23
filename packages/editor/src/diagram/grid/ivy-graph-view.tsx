import { Bounds, GLSPProjectionView, GridManager, RenderingContext, SGraphImpl, Writable } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyGraphView extends GLSPProjectionView {
  protected getBackgroundBounds(viewport: Readonly<SGraphImpl>, context: RenderingContext, gridManager: GridManager): Writable<Bounds> {
    // we define our grid as 8x8 for all intents and purposes of moving, resizing, etc.
    // however visually we render it 16x16 giving the illusion of half-grid movement
    // alternatively this could be achieved by adapting the grid snapper
    const bounds = super.getBackgroundBounds(viewport, context, gridManager);
    bounds.height = bounds.height * 2;
    bounds.width = bounds.width * 2;
    return bounds;
  }

  protected getBackgroundImage(model: Readonly<SGraphImpl>, context: RenderingContext, gridManager: GridManager): string {
    return `radial-gradient(var(--glsp-grid) ${model.zoom}px, transparent 0)`;
  }
}
