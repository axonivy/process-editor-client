import { SNode } from '@eclipse-glsp/client';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { addCssClass, addCssClassToElements, removeCssClass, removeCssClassOfElements } from '../../src/utils/element-css-classes';

describe('ElementCssClassesUtil', () => {
  const node = new SNode();
  const node2 = new SNode();

  afterEach(() => {
    node.cssClasses = undefined;
    node2.cssClasses = undefined;
  });

  it('addCssClass', () => {
    addCssClass(node, 'test');
    expect(node.cssClasses).is.not.undefined;
    expect(node.cssClasses).to.include('test');
  });

  it('addCssClass only once', () => {
    addCssClass(node, 'test');
    addCssClass(node, 'test');
    addCssClass(node, 'test2');
    expect(node.cssClasses).to.have.length(2).and.to.include('test').and.include('test2');
  });

  it('removeCssClass', () => {
    node.cssClasses = ['bla', 'test'];
    removeCssClass(node, 'test');
    expect(node.cssClasses).to.include('bla').but.not.to.include('test');
  });

  it('removeCssClass of empty array', () => {
    removeCssClass(node, 'nothingToRemove');
    expect(node.cssClasses).to.be.undefined;
  });

  it('addCssClassToElements', () => {
    addCssClassToElements([node, node2], 'test');
    expect(node.cssClasses).is.not.undefined;
    expect(node.cssClasses).to.include('test');
    expect(node2.cssClasses).is.not.undefined;
    expect(node2.cssClasses).to.include('test');
  });

  it('addCssClassToElements only once', () => {
    addCssClassToElements([node, node2], 'test');
    addCssClassToElements([node, node2], 'test');
    addCssClassToElements([node, node2], 'test2');
    expect(node.cssClasses).to.have.length(2).and.to.include('test').and.include('test2');
    expect(node2.cssClasses).to.have.length(2).and.to.include('test').and.include('test2');
  });

  it('removeCssClassOfElements', () => {
    node.cssClasses = ['bla', 'test'];
    node2.cssClasses = ['bla', 'test'];
    removeCssClassOfElements([node, node2], 'test');
    expect(node.cssClasses).to.include('bla').but.not.to.include('test');
    expect(node2.cssClasses).to.include('bla').but.not.to.include('test');
  });

  it('removeCssClassOfElements of empty array', () => {
    removeCssClassOfElements([node, node2], 'nothingToRemove');
    expect(node.cssClasses).to.be.undefined;
    expect(node2.cssClasses).to.be.undefined;
  });
});
