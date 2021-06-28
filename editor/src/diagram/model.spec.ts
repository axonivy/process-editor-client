import { SEdge, SModelRoot } from '@eclipse-glsp/client';
import { expect } from 'chai';

import { Edge, EndEventNode, EventNode, StartEventNode, TaskNode } from './model';

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

describe('TaskNodes', () => {
  it('Correct Icons are returned for the different node types', () => {
    const node = new TaskNode();
    node.type = 'node:script';
    expect(node.icon).to.be.equals('fa-cog');
    node.type = 'node:hd';
    expect(node.icon).to.be.equals('fa-desktop');
    node.type = 'node:user';
    expect(node.icon).to.be.equals('fa-user');
    node.type = 'node:soap';
    expect(node.icon).to.be.equals('fa-globe');
    node.type = 'node:rest';
    expect(node.icon).to.be.equals('fa-exchange-alt');
    node.type = 'node:db';
    expect(node.icon).to.be.equals('fa-database');
    node.type = 'node:email';
    expect(node.icon).to.be.equals('fa-envelope');
  });
});

function createEdgeModel(): Edge {
  const root = new SModelRoot();
  const source = new TaskNode();
  source.bounds = { x: 10, y: 10, width: 20, height: 10 };
  const target = new TaskNode();
  target.bounds = { x: 50, y: 10, width: 20, height: 10 };
  const edge = new Edge();
  root.add(edge);
  root.add(source);
  root.add(target);
  edge.sourceId = source.id;
  edge.targetId = target.id;
  return edge;
}

describe('Edges', () => {

  it('Bounds of empty edge are equals empty bounds', () => {
    const root = new SModelRoot();
    const emptyEdge = new Edge();
    root.add(emptyEdge);
    expect(emptyEdge.bounds).to.be.deep.equals({ x: 0, y: 0, height: -1, width: -1 });
  });

  /** This is important for the correct position of the edge tooltip */
  it('Bounds are calculated correctly', () => {
    const edge = createEdgeModel();
    expect(edge.bounds).to.be.deep.equals({ x: 40, y: 15, height: -1, width: -1 });
  });

  it('Bounds of edge one routing point is rounting point position', () => {
    const edge = createEdgeModel();
    edge.routingPoints.push({ x: 30, y: 30 });
    expect(edge.bounds).to.be.deep.equals({ x: 30, y: 30, height: 0, width: 0 });
  });

  it('Bounds of edge with multiple routing points is calculated of all rounding points', () => {
    const edge = createEdgeModel();
    edge.routingPoints.push({ x: 30, y: 30 });
    edge.routingPoints.push({ x: 60, y: 20 });
    edge.routingPoints.push({ x: 50, y: 10 });
    expect(edge.bounds).to.be.deep.equals({ x: 30, y: 10, height: 20, width: 30 });
  });
});
