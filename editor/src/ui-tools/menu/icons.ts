import { StreamlineIcons } from '../../StreamlineIcons';
import {
  ActivityTypes,
  EventBoundaryTypes,
  EventEndTypes,
  EventIntermediateTypes,
  EventStartTypes,
  GatewayTypes,
  LaneTypes
} from '../../diagram/view-types';

export const MenuIcons = new Map<string, string>([
  // Start Events
  [EventStartTypes.START, StreamlineIcons.Start],
  [EventStartTypes.START_SIGNAL, StreamlineIcons.Signal],
  [EventStartTypes.START_PROGRAM, StreamlineIcons.StartProgram],
  [EventStartTypes.START_ERROR, StreamlineIcons.ErrorEvent],
  [EventStartTypes.START_SUB, StreamlineIcons.SubStart],
  [EventStartTypes.START_WS, StreamlineIcons.WsEvent],
  [EventStartTypes.START_HD, StreamlineIcons.InitStart],
  [EventStartTypes.START_HD_METHOD, StreamlineIcons.MethodStart],
  [EventStartTypes.START_HD_EVENT, StreamlineIcons.EventStart],
  // Intermediate Events
  [EventIntermediateTypes.INTERMEDIATE_TASK, StreamlineIcons.Task],
  [EventIntermediateTypes.INTERMEDIATE_WAIT, StreamlineIcons.Wait],
  // Boundary Events
  [EventBoundaryTypes.BOUNDARY_ERROR, StreamlineIcons.ErrorEvent],
  [EventBoundaryTypes.BOUNDARY_SIGNAL, StreamlineIcons.Signal],
  // End Events
  [EventEndTypes.END, StreamlineIcons.End],
  [EventEndTypes.END_PAGE, StreamlineIcons.EndPage],
  [EventEndTypes.END_ERROR, StreamlineIcons.ErrorEvent],
  [EventEndTypes.END_SUB, StreamlineIcons.SubEnd],
  [EventEndTypes.END_WS, StreamlineIcons.WsEvent],
  [EventEndTypes.END_HD, StreamlineIcons.End],
  [EventEndTypes.END_HD_EXIT, StreamlineIcons.ExitEnd],
  // Gateways
  [GatewayTypes.ALTERNATIVE, StreamlineIcons.Alternative],
  [GatewayTypes.SPLIT, StreamlineIcons.Split],
  [GatewayTypes.JOIN, StreamlineIcons.Join],
  [GatewayTypes.TASK, StreamlineIcons.Tasks],
  // Workflow Activities
  [ActivityTypes.USER, StreamlineIcons.UserTask],
  [ActivityTypes.HD, StreamlineIcons.UserDialog],
  [ActivityTypes.SCRIPT, StreamlineIcons.Script],
  [ActivityTypes.EMBEDDED_PROCESS, StreamlineIcons.Sub],
  [ActivityTypes.SUB_PROCESS, StreamlineIcons.Sub],
  [ActivityTypes.TRIGGER, StreamlineIcons.Trigger],
  // Interface Activities
  [ActivityTypes.DB, StreamlineIcons.Database],
  [ActivityTypes.SOAP, StreamlineIcons.WebService],
  [ActivityTypes.REST, StreamlineIcons.RestClient],
  [ActivityTypes.EMAIL, StreamlineIcons.EMail],
  [ActivityTypes.THIRD_PARTY, StreamlineIcons.Dialogs],
  [ActivityTypes.THIRD_PARTY_RULE, StreamlineIcons.Rule],
  [ActivityTypes.PROGRAM, StreamlineIcons.Program],
  // BPMN Activities
  [ActivityTypes.BPMN_GENERIC, StreamlineIcons.Sub],
  [ActivityTypes.BPMN_USER, StreamlineIcons.User],
  [ActivityTypes.BPMN_MANUAL, StreamlineIcons.Manual],
  [ActivityTypes.BPMN_SCRIPT, StreamlineIcons.Script],
  [ActivityTypes.BPMN_SERVICE, StreamlineIcons.Service],
  [ActivityTypes.BPMN_RULE, StreamlineIcons.Rule],
  [ActivityTypes.BPMN_SEND, StreamlineIcons.Send],
  [ActivityTypes.BPMN_RECEIVE, StreamlineIcons.Receive],
  // Artifacts
  [ActivityTypes.COMMENT, StreamlineIcons.Note],
  [LaneTypes.POOL, StreamlineIcons.PoolSwimlanes],
  [LaneTypes.LANE, StreamlineIcons.LaneSwimlanes]
]);
