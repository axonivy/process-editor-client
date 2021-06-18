import {
    angleOfPoint,
    CircularNodeView,
    GEdgeView,
    IView,
    Point,
    RectangularNodeView,
    RenderingContext,
    SEdge,
    SLabel,
    SLabelView,
    SShapeElement,
    toDegrees
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import * as snabbdom from 'snabbdom-jsx';
import { VNode } from 'snabbdom/vnode';

import { EventNode, Icon, LaneNode, TaskNode } from './model';

const virtualize = require('snabbdom-virtualize/strings').default;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: snabbdom.svg };

export class LaneNodeView extends RectangularNodeView {
    render(node: LaneNode, context: RenderingContext): VNode {
        return <g>
            <rect class-sprotty-node={true} x="0" y="0" width={Math.max(node.size.width, 0)} height={Math.max(node.size.height, 0)}></rect>
            {this.getDecoratorLine(node)}
            {context.renderChildren(node)}
        </g>;
    }

    protected getDecoratorLine(node: LaneNode): VNode {
        return <g></g>;
    }

}

export class PoolNodeView extends LaneNodeView {
    protected getDecoratorLine(node: LaneNode): VNode {
        return <rect class-sprotty-node={true} x="0" y="0" width={30} height={Math.max(node.size.height, 0)}></rect>;
    }
}

@injectable()
export class EventNodeView extends CircularNodeView {
    render(node: EventNode, context: RenderingContext): VNode {
        const radius = this.getRadius(node);
        return <g>
            <circle class-sprotty-node={true} class-animate={node.animated}
                class-mouseover={node.hoverFeedback} class-selected={node.selected}
                r={radius} cx={radius} cy={radius}></circle>
            {this.getTaskDecorator(node)}
            {this.getDecorator(node)}
            {context.renderChildren(node)}
        </g>;
    }

    protected getTaskDecorator(node: EventNode): VNode {
        return <g></g>;
    }

    protected getDecorator(node: EventNode): VNode {
        return <svg height={14} width={14} x={8} y={8} viewBox={'0 0 10 10'}
            class-sprotty-node-decorator={true}>
            <path fill={'none'} d={this.getDecoratorPath()}></path>
        </svg>;
    }

    protected getDecoratorPath(): string {
        return '';
    }
}

@injectable()
export class IntermediateEventNodeView extends EventNodeView {
    protected getTaskDecorator(node: EventNode): VNode {
        const radius = this.getRadius(node);
        return <circle class-sprotty-node={true} class-sprotty-task-node={true}
            r={radius - 3} cx={radius} cy={radius}></circle>;
    }
}

@injectable()
export class SignalEventNodeView extends EventNodeView {
    protected getDecoratorPath(): string {
        return 'M5,0 L10,10 l-10,0 Z';
    }
}

@injectable()
export class BoundarySignalEventNodeView extends IntermediateEventNodeView {
    protected getDecoratorPath(): string {
        return 'M5,0 L10,10 l-10,0 Z';
    }
}

@injectable()
export class ErrorEventNodeView extends EventNodeView {
    protected getDecoratorPath(): string {
        return 'M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z';
    }
}

@injectable()
export class BoundaryErrorEventNodeView extends IntermediateEventNodeView {
    protected getDecoratorPath(): string {
        return 'M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z';
    }
}

@injectable()
export class TaskNodeView extends RectangularNodeView {
    render(node: TaskNode, context: RenderingContext): VNode {
        const rcr = this.getRoundedCornerRadius(node);
        return <g>
            <rect class-sprotty-node={true} class-task={true} class-animate={node.animated}
                class-mouseover={node.hoverFeedback} class-selected={node.selected}
                x={0} y={0} rx={rcr} ry={rcr}
                width={Math.max(0, node.bounds.width)} height={Math.max(0, node.bounds.height)}></rect>
            {this.getIconDecorator(node)}
            {this.getNodeDecorator(node)}
            {context.renderChildren(node)}
        </g>;
    }

    protected getNodeDecorator(node: TaskNode): VNode {
        return <g></g>;
    }

    protected getIconDecorator(node: TaskNode): VNode {
        const icon = node.icon;
        if (!icon) {
            return <g></g>;
        }
        const foreignObjectContents = virtualize('<i class="fa ' + icon + '"></i>');
        return <g>
            <foreignObject requiredFeatures='http://www.w3.org/TR/SVG11/feature#Extensibility'
                height={16} width={20} x={2} y={2}
                class-sprotty-icon>
                {foreignObjectContents}
            </foreignObject>
        </g>;
    }

    protected getRoundedCornerRadius(node: SShapeElement): number {
        return 5;
    }
}

@injectable()
export class SubTaskNodeView extends TaskNodeView {
    protected getNodeDecorator(node: TaskNode): VNode {
        const diameter = 10;
        const radius = diameter / 2;
        const padding = 2;
        return <svg x={node.bounds.width / 2 - radius} y={node.bounds.height - diameter}>
            <rect class-sprotty-node={true} class-sprotty-task-node={true}
                width={diameter} height={diameter} />
            <line class-sprotty-node-decorator x1={radius} y1={padding} x2={radius} y2={diameter - padding} />
            <line class-sprotty-node-decorator x1={padding} y1={radius} x2={diameter - padding} y2={radius} />
        </svg>;
    }
}

@injectable()
export class ForeignLabelView implements IView {
    render(model: SLabel, context: RenderingContext): VNode {
        const replacement = model.text.replace(/\n/g, '<br/>');
        const foreignObjectContents = virtualize('<div>' + replacement + '</div>');
        const node = <g>
            <foreignObject requiredFeatures='http://www.w3.org/TR/SVG11/feature#Extensibility'
                height={model.bounds.height} width={model.bounds.width} x={0} y={0} z={10}
                class-sprotty-label>
                {foreignObjectContents}
            </foreignObject>
            {context.renderChildren(model)}
        </g>;
        return node;
    }
}

@injectable()
export class RotateLabelView extends SLabelView {
    render(label: Readonly<SLabel>, context: RenderingContext): VNode | undefined {
        const rotate = `rotate(270) translate(-${label.bounds.height / 2} ${label.bounds.width / 2})`;
        return <text class-sprotty-label={true} transform={rotate} >
            <tspan>{label.text}</tspan>
        </text>;
    }
}

@injectable()
export class WorkflowEdgeView extends GEdgeView {
    protected renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
        const additionals = super.renderAdditionals(edge, segments, context);
        const p1 = segments[segments.length - 2];
        const p2 = segments[segments.length - 1];
        const arrow = <path class-sprotty-edge={true} class-arrow={true} d='M 1.5,0 L 10,-4 L 10,4 Z'
            transform={`rotate(${toDegrees(angleOfPoint({ x: p1.x - p2.x, y: p1.y - p2.y }))} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`} />;
        additionals.push(arrow);
        return additionals;
    }
}

@injectable()
export class IconView implements IView {
    render(element: Icon, context: RenderingContext): VNode {
        const radius = this.getRadius();
        return <g>
            <circle class-sprotty-icon={true} r={radius} cx={radius} cy={radius}></circle>
            {context.renderChildren(element)}
        </g>;
    }

    getRadius(): number {
        return 16;
    }
}
