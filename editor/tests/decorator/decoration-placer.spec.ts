import { boundsFeature, createFeatureSet, getOrCreateSIssueMarker, ORIGIN_POINT, SModelElement, SModelRoot } from '@eclipse-glsp/client';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { IvyDecorationPlacer } from '../../src/decorator/decoration-placer';
import { ActivityNode } from '../../src/diagram/model';

describe('IvyDecorationPlacer', () => {
  const placer = new IvyDecorationPlacer();

  it('elemnt should return origin point', () => {
    const element = new SModelElement();
    expect(placer.getPosition(element)).to.deep.equals(ORIGIN_POINT);
  });

  it('resizable element should has position bottom left', () => {
    const root = new SModelRoot();
    const element = new ActivityNode();
    element.size = { width: 30, height: 30 };
    element.position = { x: 40, y: 20 };
    element.features = createFeatureSet([boundsFeature]);
    root.add(element);
    const marker = getOrCreateSIssueMarker(element);
    expect(placer.getPosition(marker)).to.deep.equals({ x: -8, y: 20 });
  });
});
