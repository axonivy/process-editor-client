import { injectable } from 'inversify';
import * as snabbdom from 'snabbdom-jsx';
import { VNode } from 'snabbdom/vnode';
import { IView, Point, RenderingContext, setAttr } from 'sprotty';

import { isSmartable, SmartActionHandleLocation, SSmartActionHandle } from './model';

const virtualize = require('snabbdom-virtualize/strings').default;

const JSX = { createElement: snabbdom.svg };

/**
* This view is used for the invisible end of the feedback edge.
* A feedback edge is shown as a visual feedback when creating edges.
*/

@injectable()
export class SSmartActionHandleView implements IView {
    render(handle: SSmartActionHandle, context: RenderingContext): VNode {
        const position = this.getPosition(handle);
        if (position !== undefined) {
            const node = <g>
                <circle class-ivy-smart-action-handle={true} class-mouseover={handle.hoverFeedback}
                    cx={position.x} cy={position.y} r={this.getRadius()}></circle>
                {this.getIconDecorator(handle, position)}
            </g>;
            setAttr(node, 'data-kind', handle.location);
            return node;
        }
        return <g />;
    }

    protected getPosition(handle: SSmartActionHandle): Point | undefined {
        const parent = handle.parent;
        if (isSmartable(parent)) {
            if (handle.location === SmartActionHandleLocation.TopLeft) {
                return { x: 10, y: -20 };
            } else if (handle.location === SmartActionHandleLocation.TopRight) {
                return { x: 50, y: -20 };
            }
        }
        return undefined;
    }

    protected getIconDecorator(handle: SSmartActionHandle, position: Point): VNode {
        const icon = handle.icon();
        const foreignObjectContents = virtualize('<i class="fas fa-' + icon + '"></i>');
        const posDiff =  this.getRadius() / 2;
        return <g>
            <foreignObject requiredFeatures='http://www.w3.org/TR/SVG11/feature#Extensibility'
                height={16} width={16} x={position.x - posDiff} y={position.y - posDiff}
                class-sprotty-icon>
                {foreignObjectContents}
            </foreignObject>
        </g>;
    }

    getRadius(): number {
        return 14;
    }
}
