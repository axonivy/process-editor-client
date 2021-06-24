import { SEdge } from '@eclipse-glsp/client';
import { expect } from 'chai';

import { EndEventNode, EventNode, StartEventNode } from './model';

describe('EventNodes', () => {

  const routable = new SEdge();
  it('end can only connect as target', () => {
    const endNode = new EndEventNode();
    expect(endNode.canConnect(routable, 'target')).to.be.true;
    expect(endNode.canConnect(routable, 'source')).to.be.false;
    expect(endNode.canConnect(routable, 'something')).to.be.false;
  });

  it('start can only connect as source', () => {
    const startNode = new StartEventNode();
    expect(startNode.canConnect(routable, 'source')).to.be.true;
    expect(startNode.canConnect(routable, 'target')).to.be.false;
    expect(startNode.canConnect(routable, 'something')).to.be.false;
  });

  it('intermediates can be connected in both ways', () => {
    const intermediateNode = new EventNode();
    expect(intermediateNode.canConnect(routable, 'source')).to.be.true;
    expect(intermediateNode.canConnect(routable, 'target')).to.be.true;
    expect(intermediateNode.canConnect(routable, 'something')).to.be.true;
  });
});
