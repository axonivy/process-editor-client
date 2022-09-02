import { StreamlineIcons } from '../../StreamlineIcons';
import { ActivityTypes, EventBoundaryTypes, EventEndTypes, EventIntermediateTypes, EventStartTypes, GatewayTypes } from '../view-types';

export enum IconStyle {
  SI,
  IMG,
  NO
}

export interface NodeIcon {
  res: string;
  style: IconStyle;
}
export const NoIcon = { res: '', style: IconStyle.NO };

export const ElementIcons = new Map<string, string>([
  // Start Events
  [EventStartTypes.START_SIGNAL, StreamlineIcons.SignalElement],
  [EventStartTypes.START_PROGRAM, StreamlineIcons.StartProgramElement],
  [EventStartTypes.START_ERROR, StreamlineIcons.ErrorEventElement],
  [EventStartTypes.START_SUB, StreamlineIcons.SubStartElement],
  [EventStartTypes.START_WS, StreamlineIcons.WsEventElement],
  [EventStartTypes.START_HD, StreamlineIcons.InitStartElement],
  [EventStartTypes.START_HD_METHOD, StreamlineIcons.MethodStartElement],
  [EventStartTypes.START_HD_EVENT, StreamlineIcons.EventStartElement],
  // Intermediate Events
  [EventIntermediateTypes.INTERMEDIATE_TASK, StreamlineIcons.TaskElement],
  [EventIntermediateTypes.INTERMEDIATE_WAIT, StreamlineIcons.WaitElement],
  // Boundary Events
  [EventBoundaryTypes.BOUNDARY_ERROR, StreamlineIcons.ErrorEventElement],
  [EventBoundaryTypes.BOUNDARY_SIGNAL, StreamlineIcons.SignalElement],
  // End Events
  [EventEndTypes.END_PAGE, StreamlineIcons.EndPageElement],
  [EventEndTypes.END_ERROR, StreamlineIcons.ErrorEventElement],
  [EventEndTypes.END_SUB, StreamlineIcons.SubEndElement],
  [EventEndTypes.END_WS, StreamlineIcons.WsEventElement],
  [EventEndTypes.END_HD_EXIT, StreamlineIcons.ExitEndElement],
  // Gateways
  [GatewayTypes.ALTERNATIVE, StreamlineIcons.AlternativeElement],
  [GatewayTypes.SPLIT, StreamlineIcons.SplitElement],
  [GatewayTypes.JOIN, StreamlineIcons.JoinElement],
  [GatewayTypes.TASK, StreamlineIcons.TasksElement],
  // Workflow Activities
  [ActivityTypes.USER, StreamlineIcons.UserTaskElement],
  [ActivityTypes.HD, StreamlineIcons.UserDialogElement],
  [ActivityTypes.SCRIPT, StreamlineIcons.ScriptElement],
  [ActivityTypes.EMBEDDED_PROCESS, StreamlineIcons.SubElement],
  [ActivityTypes.SUB_PROCESS, StreamlineIcons.CallElement],
  [ActivityTypes.TRIGGER, StreamlineIcons.TriggerElement],
  // Interface Activities
  [ActivityTypes.DB, StreamlineIcons.DatabaseElement],
  [ActivityTypes.SOAP, StreamlineIcons.WebServiceElement],
  [ActivityTypes.REST, StreamlineIcons.RestClientElement],
  [ActivityTypes.EMAIL, StreamlineIcons.EMailElement],
  [ActivityTypes.THIRD_PARTY_RULE, StreamlineIcons.RuleElement],
  [ActivityTypes.PROGRAM, StreamlineIcons.ProgramElement],
  // BPMN Activities
  [ActivityTypes.BPMN_GENERIC, StreamlineIcons.GenericElement],
  [ActivityTypes.BPMN_USER, StreamlineIcons.UserElement],
  [ActivityTypes.BPMN_MANUAL, StreamlineIcons.ManualElement],
  [ActivityTypes.BPMN_SCRIPT, StreamlineIcons.ScriptElement],
  [ActivityTypes.BPMN_SERVICE, StreamlineIcons.ServiceElement],
  [ActivityTypes.BPMN_RULE, StreamlineIcons.RuleElement],
  [ActivityTypes.BPMN_SEND, StreamlineIcons.SendElement],
  [ActivityTypes.BPMN_RECEIVE, StreamlineIcons.ReceiveElement]
]);

export const resolveIcon = (iconUri: string): NodeIcon => {
  if (!iconUri) {
    return NoIcon;
  }
  if (iconUri.includes('/faces/javax.faces.resource')) {
    return { res: iconUri, style: IconStyle.IMG };
  } else if (iconUri.startsWith('ext:')) {
    return { res: StreamlineIcons.Dialogs, style: IconStyle.SI };
  }
  const elementIcon = ElementIcons.get(iconUri);
  return elementIcon ? { res: elementIcon, style: IconStyle.SI } : NoIcon;
};
