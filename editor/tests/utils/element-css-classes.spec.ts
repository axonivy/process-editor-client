import { SNode } from '@eclipse-glsp/client';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { addCssClass, removeCssClass } from '../../src/utils/element-css-classes';

describe('ElementCssClassesUtil', () => {
  const node = new SNode();

  afterEach(() => {
    node.cssClasses = undefined;
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
});
