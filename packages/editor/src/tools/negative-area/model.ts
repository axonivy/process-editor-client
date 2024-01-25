import { Bounds, getModelBounds, isViewport, GChildElement, GModelElement } from '@eclipse-glsp/client';

export class NegativeMarker extends GChildElement {
  static readonly TYPE = 'negative-marker';

  constructor(
    public readonly canvasBounds: Bounds = Bounds.EMPTY,
    public readonly modelBounds: Bounds = Bounds.EMPTY,
    public readonly type: string = NegativeMarker.TYPE
  ) {
    super();
  }
}

export function addNegativeArea(element: GModelElement): void {
  removeNegativeArea(element);
  const canvasBounds = element.root.canvasBounds;
  if (isViewport(element.root)) {
    const modelBounds = getModelBounds(element.root);
    element.root.add(new NegativeMarker(canvasBounds, modelBounds!));
  }
}

export function removeNegativeArea(element: GModelElement): void {
  element.root.removeAll(child => child instanceof NegativeMarker);
}
