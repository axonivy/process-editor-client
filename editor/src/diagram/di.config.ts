import {
  configureActionHandler,
  configureModelElement,
  ConsoleLogger,
  DefaultTypes,
  DeleteElementContextMenuItemProvider,
  GEdgeView,
  LogLevel,
  moveFeature,
  popupFeature,
  selectFeature,
  SGraphView,
  TYPES
} from '@eclipse-glsp/client';
import { ContainerModule } from 'inversify';

import { errorBoundaryFeature, signalBoundaryFeature } from '../boundary/model';
import { breakpointFeature } from '../breakpoint/model';
import { jumpFeature } from '../jump/model';
import { unwrapFeature } from '../wrap/model';
import { ActivityNodeView, SubActivityNodeView } from './activities/activity-views';
import { EventNodeView, IntermediateEventNodeView } from './events/event-views';
import { GatewayNodeView } from './gateways/gateway-views';
import { CustomIconToggleAction, CustomIconToggleActionHandler } from './icon/custom-icon-toggle-action-handler';
import { LaneNodeView, PoolNodeView, RotateLabelView } from './lanes/lane-views';
import {
  ActivityLabel,
  ActivityNode,
  Edge,
  EndEventNode,
  EventNode,
  GatewayNode,
  IvyGLSPGraph,
  LaneNode,
  MulitlineEditLabel,
  RotateLabel,
  StartEventNode
} from './model';
import { IvyGridSnapper } from './snap';
import { ActivityTypes, EdgeTypes, EventTypes, GatewayTypes, LabelType, LaneTypes } from './view-types';
import { ForeignLabelView, WorkflowEdgeView } from './views';

const ivyDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
  rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
  bind(TYPES.ISnapper).to(IvyGridSnapper);
  bind(TYPES.IContextMenuItemProvider).to(DeleteElementContextMenuItemProvider);

  bind(CustomIconToggleActionHandler).toSelf().inSingletonScope();
  configureActionHandler({ bind, isBound }, CustomIconToggleAction.KIND, CustomIconToggleActionHandler);

  const context = { bind, unbind, isBound, rebind };

  configureModelElement(context, DefaultTypes.GRAPH, IvyGLSPGraph, SGraphView);

  configureModelElement(context, EventTypes.START, StartEventNode, EventNodeView);
  configureModelElement(context, EventTypes.START_ERROR, StartEventNode, EventNodeView);
  configureModelElement(context, EventTypes.START_SIGNAL, StartEventNode, EventNodeView);
  configureModelElement(context, EventTypes.START_PROGRAM, StartEventNode, EventNodeView);
  configureModelElement(context, EventTypes.START_SUB, StartEventNode, EventNodeView);
  configureModelElement(context, EventTypes.START_WS, StartEventNode, EventNodeView);
  configureModelElement(context, EventTypes.START_HD, StartEventNode, EventNodeView);
  configureModelElement(context, EventTypes.START_HD_METHOD, StartEventNode, EventNodeView);
  configureModelElement(context, EventTypes.START_HD_EVENT, StartEventNode, EventNodeView);
  configureModelElement(context, EventTypes.END, EndEventNode, EventNodeView);
  configureModelElement(context, EventTypes.END_ERROR, EndEventNode, EventNodeView);
  configureModelElement(context, EventTypes.END_PAGE, EndEventNode, EventNodeView);
  configureModelElement(context, EventTypes.END_SUB, EndEventNode, EventNodeView);
  configureModelElement(context, EventTypes.END_WS, EndEventNode, EventNodeView);
  configureModelElement(context, EventTypes.END_HD, EndEventNode, EventNodeView);
  configureModelElement(context, EventTypes.END_HD_EXIT, EndEventNode, EventNodeView);
  configureModelElement(context, EventTypes.INTERMEDIATE, EventNode, IntermediateEventNodeView);
  configureModelElement(context, EventTypes.INTERMEDIATE_TASK, EventNode, IntermediateEventNodeView);
  configureModelElement(context, EventTypes.INTERMEDIATE_WAIT, EventNode, IntermediateEventNodeView);
  configureModelElement(context, EventTypes.INTERMEDIATE_CALL_AND_WAIT, EventNode, IntermediateEventNodeView);
  configureModelElement(context, EventTypes.BOUNDARY_ERROR, StartEventNode, IntermediateEventNodeView);
  configureModelElement(context, EventTypes.BOUNDARY_SIGNAL, StartEventNode, IntermediateEventNodeView);

  configureModelElement(context, GatewayTypes.DEFAULT, GatewayNode, GatewayNodeView);
  configureModelElement(context, GatewayTypes.TASK, GatewayNode, GatewayNodeView);
  configureModelElement(context, GatewayTypes.JOIN, GatewayNode, GatewayNodeView);
  configureModelElement(context, GatewayTypes.SPLIT, GatewayNode, GatewayNodeView);
  configureModelElement(context, GatewayTypes.ALTERNATIVE, GatewayNode, GatewayNodeView);

  configureModelElement(context, ActivityTypes.COMMENT, ActivityNode, ActivityNodeView, { disable: [popupFeature, breakpointFeature, errorBoundaryFeature] });
  configureModelElement(context, ActivityTypes.SCRIPT, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.HD, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.USER, ActivityNode, ActivityNodeView, { enable: [signalBoundaryFeature] });
  configureModelElement(context, ActivityTypes.SOAP, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.REST, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.DB, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.EMAIL, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.SUB_PROCESS, ActivityNode, SubActivityNodeView);
  configureModelElement(context, ActivityTypes.EMBEDDED_PROCESS, ActivityNode, SubActivityNodeView, { enable: [jumpFeature, unwrapFeature] });
  configureModelElement(context, ActivityTypes.WEB_PAGE, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.TRIGGER, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.PROGRAMM, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.THIRD_PARTY, ActivityNode, ActivityNodeView);
  configureModelElement(context, ActivityTypes.LABEL, ActivityLabel, ForeignLabelView);

  configureModelElement(context, LaneTypes.LANE, LaneNode, LaneNodeView);
  configureModelElement(context, LaneTypes.POOL, LaneNode, PoolNodeView);
  configureModelElement(context, LaneTypes.LABEL, RotateLabel, RotateLabelView);

  configureModelElement(context, EdgeTypes.DEFAULT, Edge, WorkflowEdgeView);
  configureModelElement(context, EdgeTypes.ASSOCIATION, Edge, GEdgeView);

  configureModelElement(context, LabelType.DEFAULT, MulitlineEditLabel, ForeignLabelView, { enable: [selectFeature, moveFeature] });
});

export default ivyDiagramModule;
