import {
    angleOfPoint,
    CircularNodeView,
    Diamond,
    DiamondNodeView,
    IView,
    Point,
    PolylineEdgeView,
    RectangularNodeView,
    RenderingContext,
    SEdge,
    SLabel,
    SShapeElement,
    toDegrees
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import * as snabbdom from 'snabbdom-jsx';
import { VNode } from 'snabbdom/vnode';

import { ActivityNode, EventNode, Icon, TaskNode } from './model';

const virtualize = require('snabbdom-virtualize/strings').default;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: snabbdom.svg };

@injectable()
export class EventNodeView extends CircularNodeView {
    render(node: EventNode, context: RenderingContext): VNode {
        const radius = this.getRadius(node);
        return <g>
            <circle class-sprotty-node={true}
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
export class TaskEventNodeView extends EventNodeView {
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
export class BoundarySignalEventNodeView extends TaskEventNodeView {
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
export class BoundaryErrorEventNodeView extends TaskEventNodeView {
    protected getDecoratorPath(): string {
        return 'M0,8 L4,5 L6,7 L10,2 L6,5 L4,3 Z';
    }
}

@injectable()
export class TaskNodeView extends RectangularNodeView {
    render(node: TaskNode, context: RenderingContext): VNode {
        const rcr = this.getRoundedCornerRadius(node);
        return <g>
            <rect class-sprotty-node={true} class-task={true}
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
        const foreignObjectContents = virtualize('<i class="fa fa-fw ' + icon + '"></i>');
        // const translate = 'translate(-8, -1)';
        return <g>
            <foreignObject requiredFeatures='http://www.w3.org/TR/SVG11/feature#Extensibility'
                height={16} width={20} x={0} y={0}
                // transform={translate}
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
export class ActivityNodeView extends DiamondNodeView {
    render(node: ActivityNode, context: RenderingContext): VNode {
        const diamond = new Diamond({ height: Math.max(node.size.height, 0), width: Math.max(node.size.width, 0), x: 0, y: 0 });
        const points = `${this.svgStr(diamond.topPoint)} ${this.svgStr(diamond.rightPoint)} ${this.svgStr(diamond.bottomPoint)} ${this.svgStr(diamond.leftPoint)}`;
        return <g>
            <polygon class-sprotty-node={true}
                class-mouseover={node.hoverFeedback} class-selected={node.selected}
                points={points} />
            {this.getDecorator(node)}
            {context.renderChildren(node)}
        </g>;
    }

    protected getDecorator(node: ActivityNode): VNode {
        const radius = this.getRadius(node);
        const startCoordinate = radius / 1.5;
        const endCoordinate = node.size.height - startCoordinate;
        return <g>
            <circle class-sprotty-node={true} class-sprotty-task-node={true}
                r={radius / 2} cx={radius} cy={radius}>
            </circle>
            <line class-sprotty-node-decorator x1={radius} y1={startCoordinate} x2={radius} y2={endCoordinate} />
            <line class-sprotty-node-decorator x1={startCoordinate} y1={radius} x2={endCoordinate} y2={radius} />
        </g>;
    }

    protected getRadius(node: SShapeElement): number {
        const d = Math.min(node.size.width, node.size.height);
        return d > 0 ? d / 2 : 0;
    }

    protected svgStr(point: Point): string {
        return `${point.x},${point.y}`;
    }
}

@injectable()
export class AlternateActivityNodeView extends ActivityNodeView {
    protected getDecorator(node: ActivityNode): VNode {
        const startCoordinate = node.size.height / 3;
        const endCoordinate = node.size.height - startCoordinate;
        return <g>
            <line class-sprotty-node-decorator x1={startCoordinate} y1={startCoordinate} x2={endCoordinate} y2={endCoordinate} />
            <line class-sprotty-node-decorator x1={startCoordinate} y1={endCoordinate} x2={endCoordinate} y2={startCoordinate} />
        </g>;
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
export class WorkflowEdgeView extends PolylineEdgeView {
    protected renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
        const p1 = segments[segments.length - 2];
        const p2 = segments[segments.length - 1];
        return [
            <path class-sprotty-edge={true} class-arrow={true} d="M 1.5,0 L 10,-4 L 10,4 Z"
                transform={`rotate(${toDegrees(angleOfPoint({ x: p1.x - p2.x, y: p1.y - p2.y }))} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`} />
        ];
    }
}

@injectable()
export class AssociationEdgeView extends WorkflowEdgeView {
    protected renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
        return [];
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
