/** @jsx html */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Action, GModelRoot, ModelViewer, copyClassesFromElement, copyClassesFromVNode, html, setClass } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class PerfModelViewer extends ModelViewer {
  protected counter = 0;
  update(model: Readonly<GModelRoot>, cause?: Action): void {
    const counter = ++this.counter;
    console.time(`Viewer update (vu) (${counter})`);
    this.logger.log(this, 'rendering', model);
    console.time(`vu- renderElement (${counter})`);
    const newVDOM = <div id={this.options.baseDiv}>{this.renderer.renderElement(model)}</div>;
    console.timeEnd(`vu- renderElement (${counter})`);
    if (this.lastVDOM !== undefined) {
      const hadFocus = this.hasFocus();
      console.time(`vu- copyClassesFromVNode (${counter})`);
      copyClassesFromVNode(this.lastVDOM, newVDOM);
      console.timeEnd(`vu- copyClassesFromVNode (${counter})`);
      console.time(`vu- patch vdom (${counter})`);
      this.lastVDOM = this.patcher.call(this, this.lastVDOM, newVDOM);
      console.timeEnd(`vu- patch vdom (${counter})`);
      console.time(`vu- restoreFocus (${counter})`);
      this.restoreFocus(hadFocus);
      console.timeEnd(`vu- restoreFocus (${counter})`);
    } else if (typeof document !== 'undefined') {
      let placeholder = null;
      if (this.options.shadowRoot) {
        const shadowRoot = document.getElementById(this.options.shadowRoot)?.shadowRoot;
        if (shadowRoot) {
          placeholder = shadowRoot.getElementById(this.options.baseDiv);
        }
      } else {
        placeholder = document.getElementById(this.options.baseDiv);
      }
      if (placeholder !== null) {
        if (typeof window !== 'undefined') {
          window.addEventListener('resize', () => {
            this.onWindowResize(newVDOM);
          });
        }
        console.time(`vu- copyClassesFromElement (${counter})`);
        copyClassesFromElement(placeholder, newVDOM);
        setClass(newVDOM, this.options.baseClass, true);
        console.timeEnd(`vu- copyClassesFromElement (${counter})`);
        console.time(`vu- patch vdom (${counter})`);
        this.lastVDOM = this.patcher.call(this, placeholder, newVDOM);
        console.timeEnd(`vu- patch vdom (${counter})`);
      } else {
        this.logger.error(this, 'element not in DOM:', this.options.baseDiv);
      }
    }
    console.time(`vu- postUpdate (${counter})`);
    this.renderer.postUpdate(cause);
    console.timeEnd(`vu- postUpdate (${counter})`);
    console.timeEnd(`Viewer update (vu) (${counter})`);
  }
}
