/** @jsx html */
import { GLSPProjectionView, setAttr } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  html,
  IViewArgs,
  RenderingContext,
  ViewportRootElement
} from 'sprotty';

/**
 * TODO: Remove again after update which includes https://github.com/eclipse-glsp/glsp-client/pull/191
 * Special viewport root view that renders horizontal and vertical projection bars for quick navigation.
 */
@injectable()
export class IvyGLSPProjectionView extends GLSPProjectionView {
  override render(model: Readonly<ViewportRootElement>, context: RenderingContext, args?: IViewArgs): VNode {
    const svgElem = this.renderSvg(model, context, args);
    if (svgElem.data) {
      svgElem.data!.class = { 'sprotty-graph': true };
    }
    const rootNode: VNode = (
      <div class-sprotty-graph={false} class-projection-graph={true}>
        {svgElem}
        {this.renderProjections(model, context, args)}
      </div>
    );
    setAttr(rootNode, 'tabindex', 0);
    return rootNode;
  }
}
