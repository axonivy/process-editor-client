import { SModelElement } from '@eclipse-glsp/client';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { ActivityNode } from './model';
import { IvyGridSnapper } from './snap';

describe('IvyGridSnapper', () => {
  const snapper = new IvyGridSnapper();

  it('element with no size should snap to grid', () => {
    const element = new SModelElement();
    expect(snapper.snap({ x: 0, y: 0 }, element)).to.deep.equals({ x: 0, y: 0 });
    expect(snapper.snap({ x: 8, y: 11 }, element)).to.deep.equals({ x: 8, y: 8 });
    expect(snapper.snap({ x: 15, y: 12 }, element)).to.deep.equals({ x: 16, y: 16 });
  });

  it('center of element should snap to grid', () => {
    const element = new ActivityNode();
    element.size = { width: 10, height: 10 };
    expect(snapper.snap({ x: 0, y: 0 }, element)).to.deep.equals({ x: 3, y: 3 });
    expect(snapper.snap({ x: 10, y: 10 }, element)).to.deep.equals({ x: 11, y: 11 });
    expect(snapper.snap({ x: 55, y: 40 }, element)).to.deep.equals({ x: 59, y: 43 });
  });
});
