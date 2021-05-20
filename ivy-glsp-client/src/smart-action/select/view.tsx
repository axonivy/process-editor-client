/********************************************************************************
 * Copyright (c) 2019 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
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
                {this.getIconDecorator(position)}
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
            }
        }
        return undefined;
    }

    protected getIconDecorator(position: Point): VNode {
        const foreignObjectContents = virtualize('<i class="fas fa-trash"></i>');
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
