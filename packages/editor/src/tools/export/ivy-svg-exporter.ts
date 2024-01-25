import { Bounds, ExportSvgAction, getAbsoluteBounds, GEdge, GModelRoot, GNode, SvgExporter } from '@eclipse-glsp/client';
import { RequestAction } from '@eclipse-glsp/protocol';
import { injectable } from 'inversify';
import { getAbsoluteEdgeBounds, getAbsoluteLabelBounds } from '../../utils/diagram-utils';
import { v4 as uuid } from 'uuid';
import { MulitlineEditLabel, RotateLabel } from '../../diagram/model';

@injectable()
export class IvySvgExporter extends SvgExporter {
  override export(root: GModelRoot, _request?: RequestAction<ExportSvgAction>): void {
    if (typeof document !== 'undefined') {
      const svgElement = this.findSvgElement();
      if (svgElement) {
        // createSvg requires the svg to have a non-empty id, so we generate one if necessary
        const originalId = svgElement.id;
        try {
          svgElement.id = originalId || uuid();
          // provide generated svg code with respective sizing for proper viewing in browser and remove undesired border
          const bounds = this.getBounds(root);
          const svg = this.createSvg(svgElement, root).replace(
            'style="',
            `style="width: ${bounds.width}px !important;height: ${bounds.height}px !important;border: none !important; cursor: default !important;`
          );
          // do not give request/response id here as otherwise the action is treated as an unrequested response
          this.actionDispatcher.dispatch(ExportSvgAction.create(svg));
        } finally {
          svgElement.id = originalId;
        }
      }
    }
  }

  protected findSvgElement(): SVGSVGElement | null {
    const div = document.getElementById(this.options.hiddenDiv);
    // search for first svg element as hierarchy within Sprotty might change
    return div && div.querySelector('svg');
  }

  protected copyStyles(source: Element, target: Element, skipedProperties: string[]): void {
    const sourceStyle = getComputedStyle(source);
    const targetStyle = getComputedStyle(target);
    let diffStyle = '';
    for (let i = 0; i < sourceStyle.length; i++) {
      const key = sourceStyle[i];
      if (skipedProperties.indexOf(key) === -1) {
        const value = sourceStyle.getPropertyValue(key);
        if (targetStyle.getPropertyValue(key) !== value) {
          if (this.isCSSInlineStyle(target)) {
            target.style[key as any] = value;
          } else {
            diffStyle += key + ':' + value + ';';
          }
        }
      }
    }
    if (diffStyle !== '') {
      target.setAttribute('style', diffStyle);
    }
    // IE doesn't retrun anything on source.children
    for (let i = 0; i < source.childNodes.length; ++i) {
      const sourceChild = source.childNodes[i];
      const targetChild = target.childNodes[i];
      if (sourceChild instanceof Element) {
        this.copyStyles(sourceChild, targetChild as Element, []);
      }
    }
  }

  isCSSInlineStyle = (element: any): element is ElementCSSInlineStyle => 'style' in element;

  protected getBounds(root: GModelRoot): Bounds {
    const allBounds: Bounds[] = [];
    root.index
      .all()
      .filter(element => element.root !== element)
      .filter(element => !(element instanceof RotateLabel))
      .forEach(element => {
        if (element instanceof GNode) {
          allBounds.push(getAbsoluteBounds(element));
        }
        if (element instanceof MulitlineEditLabel && element.text.length > 0) {
          allBounds.push(getAbsoluteLabelBounds(element));
        }
        if (element instanceof GEdge) {
          allBounds.push(getAbsoluteEdgeBounds(element));
        }
      });
    return allBounds.reduce((one, two) => Bounds.combine(one, two));
  }
}
