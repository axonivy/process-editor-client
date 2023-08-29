import { Bounds, getModelBounds, isViewport, SChildElement, SModelElement } from '@eclipse-glsp/client';

export class NegativeMarker extends SChildElement {
  static readonly TYPE = 'negative-marker';

  constructor(
    public readonly canvasBounds: Bounds,
    public readonly modelBounds: Bounds,
    public readonly type: string = NegativeMarker.TYPE
  ) {
    super();
  }
}

export function addNegativeArea(element: SModelElement): void {
  removeNegativeArea(element);
  const canvasBounds = element.root.canvasBounds;
  if (isViewport(element.root)) {
    const modelBounds = getModelBounds(element.root);
    element.root.add(new NegativeMarker(canvasBounds, modelBounds!));
  }
}

export function removeNegativeArea(element: SModelElement): void {
  element.root.removeAll(child => child instanceof NegativeMarker);
}
