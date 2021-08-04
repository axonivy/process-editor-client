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

import { ActivityNodeView, SubActivityNodeView } from './activities/activity-views';
import { EventNodeView, IntermediateEventNodeView } from './events/event-views';
import { AlternateGatewayNodeView, GatewayNodeView, TaskGatewayNodeView } from './gateways/gateway-views';
import { LaneNodeView, PoolNodeView, RotateLabelView } from './lanes/lane-views';
import {
  ActivityNode,
  Edge,
  EndEventNode,
  EventNode,
  GatewayNode,
  LaneNode,
  RotateLabel,
  StartEventNode,
  SubActivityNode
} from './model';
import { IvyGridSnapper } from './snap';
import { ActivityTypes, EdgeTypes, EventTypes, GatewayTypes, LabelType, LaneTypes } from './view-types';
import { ForeignLabelView, WorkflowEdgeView } from './views';

const ivyDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
  rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
  bind(TYPES.ISnapper).to(IvyGridSnapper);
  bind(TYPES.IContextMenuItemProvider).to(DeleteElementContextMenuItemProvider);
  const context = { bind, unbind, isBound, rebind };

  configureModelElement(context, EventTypes.START, StartEventNode, EventNodeView);
  configureModelElement(context, EventTypes.START_ERROR, StartEventNode, EventNodeView);
  configureModelElement(context, EventTypes.START_SIGNAL, StartEventNode, EventNodeView);
  configureModelElement(context, EventTypes.START_PROGRAM, StartEventNode, EventNodeView);
  configureModelElement(context, EventTypes.START_SUB, StartEventNode, EventNodeView);
  configureModelElement(context, EventTypes.START_WS, StartEventNode, EventNodeView);
  configureModelElement(context, EventTypes.END, EndEventNode, EventNodeView);
  configureModelElement(context, EventTypes.END_ERROR, EndEventNode, EventNodeView);
  configureModelElement(context, EventTypes.END_PAGE, EndEventNode, EventNodeView);
  configureModelElement(context, EventTypes.END_SUB, EndEventNode, EventNodeView);
  configureModelElement(context, EventTypes.END_WS, EndEventNode, EventNodeView);
  configureModelElement(context, EventTypes.INTERMEDIATE, EventNode, IntermediateEventNodeView);
  configureModelElement(context, EventTypes.INTERMEDIATE_TASK, EventNode, IntermediateEventNodeView);
  configureModelElement(context, EventTypes.INTERMEDIATE_WAIT, EventNode, IntermediateEventNodeView);
  configureModelElement(context, EventTypes.INTERMEDIATE_CALL_AND_WAIT, EventNode, IntermediateEventNodeView);
  configureModelElement(context, EventTypes.BOUNDARY_ERROR, StartEventNode, IntermediateEventNodeView);
  configureModelElement(context, EventTypes.BOUNDARY_SIGNAL, StartEventNode, IntermediateEventNodeView);

  configureModelElement(context, GatewayTypes.DEFAULT, GatewayNode, GatewayNodeView);
  configureModelElement(context, GatewayTypes.TASK, GatewayNode, TaskGatewayNodeView);
  configureModelElement(context, GatewayTypes.ALTERNATIVE, GatewayNode, AlternateGatewayNodeView);

  configureModelElement(context, ActivityTypes.COMMENT, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.SCRIPT, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.HD, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.USER, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.SOAP, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.REST, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.DB, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.EMAIL, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.SUB_PROCESS, ActivityNode, SubActivityNodeView);
  configureModelElement(context, ActivityTypes.EMBEDDED_PROCESS, SubActivityNode, SubActivityNodeView);
  configureModelElement(context, ActivityTypes.WEB_PAGE, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.TRIGGER, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.PROGRAMM, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.THIRD_PARTY, ActivityNode, ActivityNodeView);

  configureModelElement(context, LaneTypes.LANE, LaneNode, LaneNodeView);
  configureModelElement(context, LaneTypes.POOL, LaneNode, PoolNodeView);
  configureModelElement(context, LaneTypes.LABEL, RotateLabel, RotateLabelView);

  configureModelElement(context, EdgeTypes.DEFAULT, Edge, WorkflowEdgeView);
  configureModelElement(context, EdgeTypes.ASSOCIATION, Edge, GEdgeView);

  configureModelElement(context, LabelType.DEFAULT, SLabel, ForeignLabelView);
});

export default ivyDiagramModule;
