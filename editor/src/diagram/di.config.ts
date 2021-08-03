import {
  configureModelElement,
  ConsoleLogger,
  DeleteElementContextMenuItemProvider,
  GEdgeView,
  LogLevel,
  SLabel,
  TYPES
} from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { SubTaskNodeView, TaskNodeView } from './activities/activity-views';
import {
  BoundaryErrorEventNodeView,
  BoundarySignalEventNodeView,
  EndPageEventNodeView,
  ErrorEventNodeView,
  EventNodeView,
  IntermediateEventNodeView,
  IntermediateTaskEventNodeView,
  IntermediateWaitEventNodeView,
  ProgramEventNodeView,
  SignalEventNodeView
} from './events/event-views';
import { AlternateGatewayNodeView, GatewayNodeView, TaskGatewayNodeView } from './gateways/gateway-views';
import { LaneNodeView, PoolNodeView, RotateLabelView } from './lanes/lane-views';
import {
  Edge,
  EndEventNode,
  EventNode,
  GatewayNode,
  LaneNode,
  RotateLabel,
  StartEventNode,
  SubTaskNode,
  TaskNode
} from './model';
import { IvyGridSnapper } from './snap';
import { EdgeTypes, EventTypes, GatewayTypes, LabelType, LaneTypes, NodeTypes } from './view-types';
import { ForeignLabelView, WorkflowEdgeView } from './views';

const ivyDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
  rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
  bind(TYPES.ISnapper).to(IvyGridSnapper);
  bind(TYPES.IContextMenuItemProvider).to(DeleteElementContextMenuItemProvider);
  const context = { bind, unbind, isBound, rebind };

  configureModelElement(context, EventTypes.START, StartEventNode, EventNodeView);
  configureModelElement(context, EventTypes.START_ERROR, StartEventNode, ErrorEventNodeView);
  configureModelElement(context, EventTypes.START_SIGNAL, StartEventNode, SignalEventNodeView);
  configureModelElement(context, EventTypes.START_PROGRAM, StartEventNode, ProgramEventNodeView);
  configureModelElement(context, EventTypes.END, EndEventNode, EventNodeView);
  configureModelElement(context, EventTypes.END_ERROR, EndEventNode, ErrorEventNodeView);
  configureModelElement(context, EventTypes.END_PAGE, EndEventNode, EndPageEventNodeView);
  configureModelElement(context, EventTypes.INTERMEDIATE, EventNode, IntermediateEventNodeView);
  configureModelElement(context, EventTypes.INTERMEDIATE_TASK, EventNode, IntermediateTaskEventNodeView);
  configureModelElement(context, EventTypes.INTERMEDIATE_WAIT, EventNode, IntermediateWaitEventNodeView);
  configureModelElement(context, EventTypes.INTERMEDIATE_CALL_AND_WAIT, EventNode, IntermediateWaitEventNodeView);
  configureModelElement(context, EventTypes.BOUNDARY_ERROR, StartEventNode, BoundaryErrorEventNodeView);
  configureModelElement(context, EventTypes.BOUNDARY_SIGNAL, StartEventNode, BoundarySignalEventNodeView);

  configureModelElement(context, GatewayTypes.DEFAULT, GatewayNode, GatewayNodeView);
  configureModelElement(context, GatewayTypes.TASK, GatewayNode, TaskGatewayNodeView);
  configureModelElement(context, GatewayTypes.ALTERNATIVE, GatewayNode, AlternateGatewayNodeView);

  configureModelElement(context, NodeTypes.COMMENT, TaskNode, TaskNodeView);
  configureModelElement(context, NodeTypes.SCRIPT, TaskNode, TaskNodeView);
  configureModelElement(context, NodeTypes.HD, TaskNode, TaskNodeView);
  configureModelElement(context, NodeTypes.USER, TaskNode, TaskNodeView);
  configureModelElement(context, NodeTypes.SOAP, TaskNode, TaskNodeView);
  configureModelElement(context, NodeTypes.REST, TaskNode, TaskNodeView);
  configureModelElement(context, NodeTypes.DB, TaskNode, TaskNodeView);
  configureModelElement(context, NodeTypes.EMAIL, TaskNode, TaskNodeView);
  configureModelElement(context, NodeTypes.SUB_PROCESS, TaskNode, SubTaskNodeView);
  configureModelElement(context, NodeTypes.EMBEDDED_PROCESS, SubTaskNode, SubTaskNodeView);
  configureModelElement(context, NodeTypes.WEB_PAGE, TaskNode, TaskNodeView);
  configureModelElement(context, NodeTypes.TRIGGER, TaskNode, TaskNodeView);
  configureModelElement(context, NodeTypes.PROGRAMM, TaskNode, TaskNodeView);
  configureModelElement(context, NodeTypes.THIRD_PARTY, TaskNode, TaskNodeView);

  configureModelElement(context, LaneTypes.LANE, LaneNode, LaneNodeView);
  configureModelElement(context, LaneTypes.POOL, LaneNode, PoolNodeView);
  configureModelElement(context, LaneTypes.LABEL, RotateLabel, RotateLabelView);

  configureModelElement(context, EdgeTypes.DEFAULT, Edge, WorkflowEdgeView);
  configureModelElement(context, EdgeTypes.ASSOCIATION, Edge, GEdgeView);

  configureModelElement(context, LabelType.DEFAULT, SLabel, ForeignLabelView);
});

export default ivyDiagramModule;
