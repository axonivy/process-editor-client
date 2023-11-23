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
  [EventStartTypes.START_SIGNAL, IvyIcons.StartSignalOutline],
  [EventStartTypes.START_PROGRAM, IvyIcons.StartProgramOutline],
  [EventStartTypes.START_ERROR, IvyIcons.ErrorStart],
  [EventStartTypes.START_SUB, IvyIcons.SubStart],
  [EventStartTypes.START_WS, IvyIcons.WsStartOutline],
  [EventStartTypes.START_HD, IvyIcons.InitStart],
  [EventStartTypes.START_HD_METHOD, IvyIcons.MethodStart],
  [EventStartTypes.START_HD_EVENT, IvyIcons.EventStart],
  [EventStartTypes.START_THIRD_PARTY, IvyIcons.Extension],
  // Intermediate Events
  [EventIntermediateTypes.INTERMEDIATE_TASK, IvyIcons.TaskDoubleOutline],
  [EventIntermediateTypes.INTERMEDIATE_WAIT, IvyIcons.ClockOutline],
  [EventIntermediateTypes.INTERMEDIATE_THIRD_PARTY, IvyIcons.Extension],
  // Boundary Events
  [EventBoundaryTypes.BOUNDARY_ERROR, IvyIcons.ErrorStart],
  [EventBoundaryTypes.BOUNDARY_SIGNAL, IvyIcons.StartSignalOutline],
  // End Events
  [EventEndTypes.END, IvyIcons.ProcessEnd],
  [EventEndTypes.END_PAGE, IvyIcons.EndPageOutline],
  [EventEndTypes.END_ERROR, IvyIcons.ErrorEnd],
  [EventEndTypes.END_SUB, IvyIcons.SubEnd],
  [EventEndTypes.END_WS, IvyIcons.WsStartOutline],
  [EventEndTypes.END_HD, IvyIcons.ProcessEnd],
  [EventEndTypes.END_HD_EXIT, IvyIcons.ExitEnd],
  // Gateways
  [GatewayTypes.ALTERNATIVE, IvyIcons.AlternativeGateways],
  [GatewayTypes.SPLIT, IvyIcons.JoinGateways],
  [GatewayTypes.JOIN, IvyIcons.JoinGateways],
  [GatewayTypes.TASK, IvyIcons.JoinTasksGateways],
  // Workflow Activities
  [ActivityTypes.USER, IvyIcons.UserTaskOutline],
  [ActivityTypes.HD, IvyIcons.UserDialogOutline],
  [ActivityTypes.SCRIPT, IvyIcons.ScriptFileOutline],
  [ActivityTypes.EMBEDDED_PROCESS, IvyIcons.SubActivities],
  [ActivityTypes.SUB_PROCESS, IvyIcons.SubActivities],
  [ActivityTypes.TRIGGER, IvyIcons.TriggerOutline],
  // Interface Activities
  [ActivityTypes.DB, IvyIcons.DatabaseOutline],
  [ActivityTypes.SOAP, IvyIcons.WebService],
  [ActivityTypes.REST, IvyIcons.RestClientOutline],
  [ActivityTypes.EMAIL, IvyIcons.EMailOutline],
  [ActivityTypes.THIRD_PARTY, IvyIcons.Extension],
  [ActivityTypes.THIRD_PARTY_RULE, IvyIcons.RuleOutline],
  [ActivityTypes.PROGRAM, IvyIcons.ProgramOutline],
  // BPMN Activities
  [ActivityTypes.BPMN_GENERIC, IvyIcons.SubActivities],
  [ActivityTypes.BPMN_USER, IvyIcons.UserOutline],
  [ActivityTypes.BPMN_MANUAL, IvyIcons.ManualOutline],
  [ActivityTypes.BPMN_SCRIPT, IvyIcons.ScriptFileOutline],
  [ActivityTypes.BPMN_SERVICE, IvyIcons.WebService],
  [ActivityTypes.BPMN_RULE, IvyIcons.RuleOutline],
  [ActivityTypes.BPMN_SEND, IvyIcons.SendOutline],
  [ActivityTypes.BPMN_RECEIVE, IvyIcons.ReceiveOutline],
  // Artifacts
  [ActivityTypes.COMMENT, IvyIcons.NoteOutline],
  [LaneTypes.POOL, IvyIcons.PoolSwimlanes],
  [LaneTypes.LANE, IvyIcons.LaneSwimlanes]
]);
