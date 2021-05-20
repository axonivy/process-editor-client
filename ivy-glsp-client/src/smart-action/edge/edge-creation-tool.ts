import {
    CreateEdgeOperation,
    CursorCSS,
    cursorFeedbackAction,
    DragAwareMouseListener,
    DrawFeedbackEdgeAction,
    FeedbackEdgeEndMovingMouseListener,
    isTriggerElementTypeCreationAction,
    RemoveFeedbackEdgeAction,
    TriggerElementCreationAction
} from '@eclipse-glsp/client';
import { BaseGLSPTool } from '@eclipse-glsp/client/lib/features/tools/base-glsp-tool';
import { inject, injectable } from 'inversify';
import {
    Action,
    AnchorComputerRegistry,
    EnableDefaultToolsAction,
    EnableToolsAction,
    findParentByFeature,
    IActionHandler,
    isConnectable,
    isCtrlOrCmd,
    SEdge,
    SModelElement
} from 'sprotty';

/**
 * Tool to create connections in a Diagram, by selecting a source and target node.
 */
@injectable()
export class SmartActionEdgeCreationTool extends BaseGLSPTool implements IActionHandler {
    static ID = 'smart-action-edge-creation-tool';

    @inject(AnchorComputerRegistry) protected anchorRegistry: AnchorComputerRegistry;

    protected triggerAction: SmartActionTriggerEdgeCreationAction;
    protected creationToolMouseListener: SmartActionEdgeCreationToolMouseListener;
    protected feedbackEndMovingMouseListener: FeedbackEdgeEndMovingMouseListener;

    get id(): string {
        return SmartActionEdgeCreationTool.ID;
    }

    enable(): void {
        if (this.triggerAction === undefined) {
            throw new TypeError(`Could not enable tool ${this.id}.The triggerAction cannot be undefined.`);
        }
        this.creationToolMouseListener = new SmartActionEdgeCreationToolMouseListener(this.triggerAction, this);
        this.mouseTool.register(this.creationToolMouseListener);
        this.feedbackEndMovingMouseListener = new FeedbackEdgeEndMovingMouseListener(this.anchorRegistry);
        this.mouseTool.register(this.feedbackEndMovingMouseListener);
        this.dispatchFeedback([cursorFeedbackAction(CursorCSS.OPERATION_NOT_ALLOWED)]);
    }

    disable(): void {
        this.mouseTool.deregister(this.creationToolMouseListener);
        this.mouseTool.deregister(this.feedbackEndMovingMouseListener);
        this.deregisterFeedback([new RemoveFeedbackEdgeAction(), cursorFeedbackAction()]);
    }

    handle(action: Action): Action | void {
        if (isTriggerElementTypeCreationAction(action)) {
            this.triggerAction = action;
            return new EnableToolsAction([this.id]);
        }
    }
}

@injectable()
export class SmartActionEdgeCreationToolMouseListener extends DragAwareMouseListener {
    protected source?: string;
    protected target?: string;
    protected currentTarget?: SModelElement;
    protected allowedTarget = false;
    protected proxyEdge: SEdge;

    constructor(protected triggerAction: SmartActionTriggerEdgeCreationAction, protected tool: SmartActionEdgeCreationTool) {
        super();
        this.proxyEdge = new SEdge();
        this.proxyEdge.type = triggerAction.elementTypeId;
        this.source = this.triggerAction.sourceId;
        this.tool.dispatchFeedback([new DrawFeedbackEdgeAction(this.triggerAction.elementTypeId, this.source)]);
    }

    protected reinitialize(): void {
        this.source = undefined;
        this.target = undefined;
        this.currentTarget = undefined;
        this.allowedTarget = false;
        this.tool.dispatchFeedback([new RemoveFeedbackEdgeAction()]);
    }

    nonDraggingMouseUp(_element: SModelElement, event: MouseEvent): Action[] {
        const result: Action[] = [];
        if (event.button === 0) {
            if (this.currentTarget/* && this.allowedTarget*/) {
                this.target = this.currentTarget.id;
            }
            if (this.source && this.target) {
                result.push(new CreateEdgeOperation(this.triggerAction.elementTypeId, this.source, this.target, this.triggerAction.args));
                if (!isCtrlOrCmd(event)) {
                    result.push(new EnableDefaultToolsAction());
                } else {
                    this.reinitialize();
                }
            }
        } else if (event.button === 2) {
            result.push(new EnableDefaultToolsAction());
        }
        return result;
    }

    protected isSourceSelected(): boolean {
        return this.source !== undefined;
    }

    protected isTargetSelected(): boolean {
        return this.target !== undefined;
    }

    mouseOver(target: SModelElement, event: MouseEvent): Action[] {
        const newCurrentTarget = findParentByFeature(target, isConnectable);
        if (newCurrentTarget !== this.currentTarget) {
            this.currentTarget = newCurrentTarget;
            if (this.currentTarget) {
                if (!this.isSourceSelected()) {
                    this.allowedTarget = this.isAllowedSource(newCurrentTarget);
                } else if (!this.isTargetSelected()) {
                    this.allowedTarget = this.isAllowedTarget(newCurrentTarget);
                }
                if (this.allowedTarget) {
                    const action = !this.isSourceSelected() ? cursorFeedbackAction(CursorCSS.EDGE_CREATION_SOURCE) :
                        cursorFeedbackAction(CursorCSS.EDGE_CREATION_TARGET);
                    return [action];
                }
            }
            return [cursorFeedbackAction(CursorCSS.OPERATION_NOT_ALLOWED)];
        }
        return [];
    }

    protected isAllowedSource(element: SModelElement | undefined): boolean {
        return element !== undefined && isConnectable(element) && element.canConnect(this.proxyEdge, 'source');
    }

    protected isAllowedTarget(element: SModelElement | undefined): boolean {
        return element !== undefined && isConnectable(element) && element.canConnect(this.proxyEdge, 'target');
    }
}

export class SmartActionTriggerEdgeCreationAction extends TriggerElementCreationAction {
    static readonly KIND = 'smartActionTriggerEdgeCreation';

    constructor(public readonly elementTypeId: string, public readonly sourceId: string) {
        super(elementTypeId, undefined, SmartActionTriggerEdgeCreationAction.KIND);
    }
}