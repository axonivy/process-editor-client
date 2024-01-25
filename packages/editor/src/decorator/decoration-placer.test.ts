import { boundsFeature, createFeatureSet, getOrCreateGIssueMarker, Point, GModelElement, GModelRoot } from '@eclipse-glsp/client';
import { describe, test, expect } from 'vitest';

import { IvyDecorationPlacer } from './decoration-placer';
import { ActivityNode, EventNode } from '../diagram/model';

describe('IvyDecorationPlacer', () => {
  const placer = new IvyDecorationPlacer();

  test('origin', () => {
    const element = new GModelElement();
    expect(placer.getPosition(element)).to.deep.equals(Point.ORIGIN);
  });

  test('activity should has position top center', () => {
    const root = new GModelRoot();
    const element = new ActivityNode();
    element.size = { width: 30, height: 30 };
    element.position = { x: 40, y: 20 };
    element.features = createFeatureSet([boundsFeature]);
    root.add(element);
    const marker = getOrCreateGIssueMarker(element);
    const expectedPosition = { x: -18, y: element.bounds.height - 16 };
    expect(placer.getPosition(marker)).to.deep.equals(expectedPosition);
  });

  test('event should has position bottom center', () => {
    const root = new GModelRoot();
    const element = new EventNode();
    element.size = { width: 30, height: 30 };
    element.position = { x: 40, y: 20 };
    element.features = createFeatureSet([boundsFeature]);
    root.add(element);
    const marker = getOrCreateGIssueMarker(element);
    const expectedPosition = { x: -16, y: element.bounds.height - 12 };
    expect(placer.getPosition(marker)).to.deep.equals(expectedPosition);
  });
});
