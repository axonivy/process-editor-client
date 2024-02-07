import { Bounds, GChildElement, GEdge, GModelElement } from '@eclipse-glsp/client';
import { MulitlineEditLabel } from '../diagram/model';

export function getAbsoluteEdgeBounds(edge: GEdge): Bounds {
  if (!edge.source || !edge.target) {
    return edge.bounds;
  }
  const source = edge.source;
  const target = edge.target;
  const edgePoints: Bounds[] = [];
  const EMPTY_EDGE_BOUNDS = { x: 0, y: 0, width: 0, height: 0 };
  edgePoints.push(Bounds.translate(EMPTY_EDGE_BOUNDS, Bounds.center(source.bounds)));
  edgePoints.push(...edge.routingPoints.map(point => Bounds.translate(EMPTY_EDGE_BOUNDS, { x: point.x, y: point.y })));
  edgePoints.push(Bounds.translate(EMPTY_EDGE_BOUNDS, Bounds.center(target.bounds)));
  let bounds = edgePoints.reduce((b1, b2) => Bounds.combine(b1, b2)) as Bounds;
  let current: GModelElement = edge;
  while (current instanceof GChildElement) {
    const parent = current.parent;
    bounds = parent.localToParent(bounds);
    current = parent;
  }
  return bounds;
}

export function getAbsoluteLabelBounds(element: MulitlineEditLabel): Bounds {
  let bounds = Bounds.translate(element.labelBounds, element.position);
  let current: GModelElement = element;
  while (current instanceof GChildElement) {
    const parent = current.parent;
    bounds = parent.localToParent(bounds);
    current = parent;
  }
  return bounds;
}
