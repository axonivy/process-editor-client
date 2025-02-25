import { boundsFeature, createFeatureSet, getOrCreateSIssueMarker, Point, SModelElement, SModelRoot } from '@eclipse-glsp/client';
import { describe, it, expect } from 'vitest';

import { IvyDecorationPlacer } from './decoration-placer';
import { ActivityNode, EventNode } from '../diagram/model';

describe('IvyDecorationPlacer', () => {
  const placer = new IvyDecorationPlacer();

  it('element should return origin point', () => {
    const element = new SModelElement();
    expect(placer.getPosition(element)).to.deep.equals(Point.ORIGIN);
  });

  it('activity element should has position top center', () => {
    const root = new SModelRoot();
    const element = new ActivityNode();
    element.size = { width: 30, height: 30 };
    element.position = { x: 40, y: 20 };
    element.features = createFeatureSet([boundsFeature]);
    root.add(element);
    const marker = getOrCreateSIssueMarker(element);
    const expectedPosition = { x: -18, y: element.bounds.height - 16 };
    expect(placer.getPosition(marker)).to.deep.equals(expectedPosition);
  });

  it('event element should has position bottom center', () => {
    const root = new SModelRoot();
    const element = new EventNode();
    element.size = { width: 30, height: 30 };
    element.position = { x: 40, y: 20 };
    element.features = createFeatureSet([boundsFeature]);
    root.add(element);
    const marker = getOrCreateSIssueMarker(element);
    const expectedPosition = { x: -16, y: element.bounds.height - 12 };
    expect(placer.getPosition(marker)).to.deep.equals(expectedPosition);
  });
});
