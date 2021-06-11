import { injectable } from 'inversify';
import * as snabbdom from 'snabbdom-jsx';
import { VNode } from 'snabbdom/vnode';
import { IView, Point, RenderingContext } from 'sprotty';

import { SJumpOutHandle } from './model';

const virtualize = require('snabbdom-virtualize/strings').default;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: snabbdom.svg };

@injectable()
export class SJumpOutHandleView implements IView {
    render(handle: SJumpOutHandle, context: RenderingContext): VNode {
        const position = this.getPosition(handle);
        if (position !== undefined) {
            const node = <g>
                {this.getIconDecorator(handle, position)}
            </g>;
            return node;
        }
        return <g />;
    }

    protected getPosition(handle: SJumpOutHandle): Point | undefined {
        return { x: 15, y: 15 };
    }

    protected getIconDecorator(handle: SJumpOutHandle, position: Point): VNode {
        const foreignObjectContents = virtualize('<i class="fas fa-level-up-alt"></i>');
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
