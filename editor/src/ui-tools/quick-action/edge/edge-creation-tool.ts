import {
  Action,
  AnchorComputerRegistry,
  Args,
  CreateEdgeOperation,
  CursorCSS,
  cursorFeedbackAction,
  DragAwareMouseListener,
  DrawFeedbackEdgeAction,
  EnableDefaultToolsAction,
  EnableToolsAction,
  FeedbackEdgeEndMovingMouseListener,
  findParentByFeature,
  hasStringProp,
  IActionHandler,
  isConnectable,
  isCtrlOrCmd,
  Operation,
  ReconnectEdgeOperation,
  RemoveFeedbackEdgeAction,
  SEdge,
  SModelElement,
  SNode
} from '@eclipse-glsp/client';
import { BaseGLSPTool } from '@eclipse-glsp/client/lib/features/tools/base-glsp-tool';
import { inject, injectable } from 'inversify';
import { StreamlineIcons } from '../../../StreamlineIcons';

import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../quick-action';
import { isMultipleOutgoingEdgesFeature } from './model';

/**
 * Tool to create connections in a Diagram, by selecting a source and target node.
 */
@injectable()
export class QuickActionEdgeCreationTool extends BaseGLSPTool implements IActionHandler {
  static ID = 'quick-action-edge-creation-tool';

  @inject(AnchorComputerRegistry) protected anchorRegistry: AnchorComputerRegistry;

  protected triggerAction: QuickActionTriggerEdgeCreationAction;
  protected creationToolMouseListener: QuickActionEdgeCreationToolMouseListener;
  protected feedbackEndMovingMouseListener: FeedbackEdgeEndMovingMouseListener;

  get id(): string {
    return QuickActionEdgeCreationTool.ID;
  }

  enable(): void {
    if (this.triggerAction === undefined) {
      throw new TypeError(`Could not enable tool ${this.id}.The triggerAction cannot be undefined.`);
    }
    this.creationToolMouseListener = new QuickActionEdgeCreationToolMouseListener(this.triggerAction, this);
    this.mouseTool.register(this.creationToolMouseListener);
    this.feedbackEndMovingMouseListener = new FeedbackEdgeEndMovingMouseListener(this.anchorRegistry);
    this.mouseTool.register(this.feedbackEndMovingMouseListener);
    this.dispatchFeedback([cursorFeedbackAction(CursorCSS.OPERATION_NOT_ALLOWED)]);
  }

  disable(): void {
    this.mouseTool.deregister(this.creationToolMouseListener);
    this.mouseTool.deregister(this.feedbackEndMovingMouseListener);
    this.deregisterFeedback([RemoveFeedbackEdgeAction.create(), cursorFeedbackAction()]);
  }

  handle(action: Action): Action | void {
    if (QuickActionTriggerEdgeCreationAction.is(action)) {
      this.triggerAction = action;
      return EnableToolsAction.create([this.id]);
    }
  }
}

export class QuickActionEdgeCreationToolMouseListener extends DragAwareMouseListener {
  protected source?: string;
  protected target?: string;
  protected currentTarget?: SModelElement;
  protected allowedTarget = false;
  protected proxyEdge: SEdge;

  constructor(protected triggerAction: QuickActionTriggerEdgeCreationAction, protected tool: QuickActionEdgeCreationTool) {
    super();
    this.proxyEdge = new SEdge();
    this.proxyEdge.type = triggerAction.elementTypeId;
    this.proxyEdge.sourceId = triggerAction.sourceId;
    this.source = this.triggerAction.sourceId;
    this.tool.dispatchFeedback([DrawFeedbackEdgeAction.create({ elementTypeId: this.triggerAction.elementTypeId, sourceId: this.source })]);
  }

  protected reinitialize(): void {
    this.source = undefined;
    this.target = undefined;
    this.currentTarget = undefined;
    this.allowedTarget = false;
    this.tool.dispatchFeedback([RemoveFeedbackEdgeAction.create()]);
  }

  nonDraggingMouseUp(_element: SModelElement, event: MouseEvent): Action[] {
    const result: Action[] = [];
    if (event.button === 0) {
      if (this.currentTarget /* && this.allowedTarget*/) {
        this.target = this.currentTarget.id;
      }
      if (this.source && this.target) {
        result.push(this.edgeOperation(this.source, this.target));
        if (!isCtrlOrCmd(event)) {
          result.push(EnableDefaultToolsAction.create());
        } else {
          this.reinitialize();
        }
      }
    } else if (event.button === 2) {
      result.push(EnableDefaultToolsAction.create());
    }
    return result;
  }

  private edgeOperation(sourceId: string, targetId: string): Operation {
    if (this.triggerAction.reconnect && this.triggerAction.edgeId) {
      return ReconnectEdgeOperation.create({
        edgeElementId: this.triggerAction.edgeId,
        sourceElementId: sourceId,
        targetElementId: targetId,
        args: this.triggerAction.args
      });
    }
    return CreateEdgeOperation.create({
      elementTypeId: this.triggerAction.elementTypeId,
      sourceElementId: sourceId,
      targetElementId: targetId,
      args: this.triggerAction.args
    });
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
          const action = !this.isSourceSelected()
            ? cursorFeedbackAction(CursorCSS.EDGE_CREATION_SOURCE)
            : cursorFeedbackAction(CursorCSS.EDGE_CREATION_TARGET);
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

export interface QuickActionTriggerEdgeCreationAction extends Action {
  kind: typeof QuickActionTriggerEdgeCreationAction.KIND;
  elementTypeId: string;
  sourceId: string;
  reconnect?: boolean;
  edgeId?: string;
  args?: Args;
}

export namespace QuickActionTriggerEdgeCreationAction {
  export const KIND = 'quickActionTriggerEdgeCreation';

  export function is(object: any): object is QuickActionTriggerEdgeCreationAction {
    return Action.hasKind(object, KIND) && hasStringProp(object, 'elementTypeId') && hasStringProp(object, 'sourceId');
  }

  export function create(
    elementTypeId: string,
    sourceId: string,
    options: { reconnect?: boolean; edgeId?: string; args?: Args } = {}
  ): QuickActionTriggerEdgeCreationAction {
    return {
      kind: KIND,
      elementTypeId,
      sourceId,
      ...options
    };
  }
}

@injectable()
export class ConnectQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    const edge = new SEdge();
    edge.type = 'edge';
    if (
      element instanceof SNode &&
      element.canConnect(edge, 'source') &&
      (Array.from(element.outgoingEdges).length === 0 || isMultipleOutgoingEdgesFeature(element))
    ) {
      return new ConnectQuickAction(element.id);
    }
    return undefined;
  }
}

class ConnectQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = StreamlineIcons.Connector,
    public readonly title = 'Connect',
    public readonly location = QuickActionLocation.Right,
    public readonly sorting = 'Z',
    public readonly action = QuickActionTriggerEdgeCreationAction.create('edge', elementId)
  ) {}
}
