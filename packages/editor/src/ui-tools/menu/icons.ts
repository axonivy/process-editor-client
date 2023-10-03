import { IvyIcons } from '@axonivy/editor-icons/lib';
import {
  ActivityTypes,
  EventBoundaryTypes,
  EventEndTypes,
  EventIntermediateTypes,
  EventStartTypes,
  GatewayTypes,
  LaneTypes
} from '../../diagram/view-types';

export const MenuIcons = new Map<string, IvyIcons>([
  // Start Events
  [EventStartTypes.START, IvyIcons.Start],
  [EventStartTypes.START_SIGNAL, IvyIcons.Signal],
  [EventStartTypes.START_PROGRAM, IvyIcons.StartProgram],
  [EventStartTypes.START_ERROR, IvyIcons.ErrorEvent],
  [EventStartTypes.START_SUB, IvyIcons.SubStart],
  [EventStartTypes.START_WS, IvyIcons.WsEvent],
  [EventStartTypes.START_HD, IvyIcons.InitStart],
  [EventStartTypes.START_HD_METHOD, IvyIcons.MethodStart],
  [EventStartTypes.START_HD_EVENT, IvyIcons.EventStart],
  [EventStartTypes.START_THIRD_PARTY, IvyIcons.StartProgram],
  // Intermediate Events
  [EventIntermediateTypes.INTERMEDIATE_TASK, IvyIcons.Task],
  [EventIntermediateTypes.INTERMEDIATE_WAIT, IvyIcons.Wait],
  [EventIntermediateTypes.INTERMEDIATE_THIRD_PARTY, IvyIcons.Wait],
  // Boundary Events
  [EventBoundaryTypes.BOUNDARY_ERROR, IvyIcons.ErrorEvent],
  [EventBoundaryTypes.BOUNDARY_SIGNAL, IvyIcons.Signal],
  // End Events
  [EventEndTypes.END, IvyIcons.End],
  [EventEndTypes.END_PAGE, IvyIcons.EndPage],
  [EventEndTypes.END_ERROR, IvyIcons.ErrorEvent],
  [EventEndTypes.END_SUB, IvyIcons.SubEnd],
  [EventEndTypes.END_WS, IvyIcons.WsEvent],
  [EventEndTypes.END_HD, IvyIcons.End],
  [EventEndTypes.END_HD_EXIT, IvyIcons.ExitEnd],
  // Gateways
  [GatewayTypes.ALTERNATIVE, IvyIcons.Alternative],
  [GatewayTypes.SPLIT, IvyIcons.Split],
  [GatewayTypes.JOIN, IvyIcons.Join],
  [GatewayTypes.TASK, IvyIcons.Tasks],
  // Workflow Activities
  [ActivityTypes.USER, IvyIcons.UserTask],
  [ActivityTypes.HD, IvyIcons.UserDialog],
  [ActivityTypes.SCRIPT, IvyIcons.Script],
  [ActivityTypes.EMBEDDED_PROCESS, IvyIcons.Sub],
  [ActivityTypes.SUB_PROCESS, IvyIcons.Sub],
  [ActivityTypes.TRIGGER, IvyIcons.Trigger],
  // Interface Activities
  [ActivityTypes.DB, IvyIcons.Database],
  [ActivityTypes.SOAP, IvyIcons.WebService],
  [ActivityTypes.REST, IvyIcons.RestClient],
  [ActivityTypes.EMAIL, IvyIcons.EMail],
  [ActivityTypes.THIRD_PARTY, IvyIcons.Dialogs],
  [ActivityTypes.THIRD_PARTY_RULE, IvyIcons.Rule],
  [ActivityTypes.PROGRAM, IvyIcons.Program],
  // BPMN Activities
  [ActivityTypes.BPMN_GENERIC, IvyIcons.Sub],
  [ActivityTypes.BPMN_USER, IvyIcons.User],
  [ActivityTypes.BPMN_MANUAL, IvyIcons.Manual],
  [ActivityTypes.BPMN_SCRIPT, IvyIcons.Script],
  [ActivityTypes.BPMN_SERVICE, IvyIcons.Service],
  [ActivityTypes.BPMN_RULE, IvyIcons.Rule],
  [ActivityTypes.BPMN_SEND, IvyIcons.Send],
  [ActivityTypes.BPMN_RECEIVE, IvyIcons.Receive],
  // Artifacts
  [ActivityTypes.COMMENT, IvyIcons.Note],
  [LaneTypes.POOL, IvyIcons.PoolSwimlanes],
  [LaneTypes.LANE, IvyIcons.LaneSwimlanes]
]);
