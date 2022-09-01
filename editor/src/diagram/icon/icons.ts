import { StreamlineIcons } from '../../StreamlineIcons';
import { ActivityTypes, EventBoundaryTypes, EventEndTypes, EventIntermediateTypes, EventStartTypes, GatewayTypes } from '../view-types';

export enum IconStyle {
  FA,
  SI,
  SVG,
  IMG,
  UNKNOWN,
  NO
}

export interface NodeIcon {
  res: string;
  style: IconStyle;
}
export const NoIcon = { res: '', style: IconStyle.NO };

export const ElementIcons = new Map<string, string>([
  // Start Events
  [EventStartTypes.START_SIGNAL, StreamlineIcons.Signal],
  [EventStartTypes.START_PROGRAM, StreamlineIcons.StartProgram],
  [EventStartTypes.START_ERROR, StreamlineIcons.ErrorEvent],
  // Intermediate Events
  [EventIntermediateTypes.INTERMEDIATE_TASK, StreamlineIcons.Task],
  [EventIntermediateTypes.INTERMEDIATE_WAIT, StreamlineIcons.Wait],
  // Boundary Events
  [EventBoundaryTypes.BOUNDARY_ERROR, StreamlineIcons.ErrorEvent],
  [EventBoundaryTypes.BOUNDARY_SIGNAL, StreamlineIcons.Signal],
  // End Events
  [EventEndTypes.END_PAGE, StreamlineIcons.EndPage],
  [EventEndTypes.END_ERROR, StreamlineIcons.ErrorEvent],
  // Gateways
  [GatewayTypes.ALTERNATIVE, StreamlineIcons.AlternativeElement],
  [GatewayTypes.SPLIT, StreamlineIcons.Split],
  [GatewayTypes.JOIN, StreamlineIcons.Join],
  [GatewayTypes.TASK, StreamlineIcons.Tasks],
  // Workflow Activities
  [ActivityTypes.USER, StreamlineIcons.UserTask],
  [ActivityTypes.HD, StreamlineIcons.UserDialogElement],
  [ActivityTypes.SCRIPT, StreamlineIcons.Script],
  [ActivityTypes.EMBEDDED_PROCESS, StreamlineIcons.Sub],
  [ActivityTypes.SUB_PROCESS, StreamlineIcons.Call],
  [ActivityTypes.TRIGGER, StreamlineIcons.Trigger],
  // Interface Activities
  [ActivityTypes.DB, StreamlineIcons.Database],
  [ActivityTypes.SOAP, StreamlineIcons.WebService],
  [ActivityTypes.REST, StreamlineIcons.RestClient],
  [ActivityTypes.EMAIL, StreamlineIcons.EMailElement],
  [ActivityTypes.THIRD_PARTY_RULE, StreamlineIcons.Rule],
  [ActivityTypes.PROGRAM, StreamlineIcons.Program],
  // BPMN Activities
  [ActivityTypes.BPMN_GENERIC, StreamlineIcons.Generic],
  [ActivityTypes.BPMN_USER, StreamlineIcons.User],
  [ActivityTypes.BPMN_MANUAL, StreamlineIcons.Manual],
  [ActivityTypes.BPMN_SCRIPT, StreamlineIcons.Script],
  [ActivityTypes.BPMN_SERVICE, StreamlineIcons.Service],
  [ActivityTypes.BPMN_RULE, StreamlineIcons.Rule],
  [ActivityTypes.BPMN_SEND, StreamlineIcons.Send],
  [ActivityTypes.BPMN_RECEIVE, StreamlineIcons.Receive]
]);

// const StandardIcons: { [icon: string]: NodeIcon } = {
//   // No icon
//   'std:NoDecorator': NoIcon,
//   'std:End': NoIcon,
//   // Standard icons
//   'std:Step': { res: 'si si-script', style: IconStyle.SI },
//   'std:UserDialog': { res: 'si si-user-dialog', style: IconStyle.SI },
//   'std:User': { res: 'si si-user', style: IconStyle.SI },
//   'std:WebService': { res: 'si si-web-service', style: IconStyle.SI },
//   'std:RestClient': { res: 'si si-rest-client', style: IconStyle.SI },
//   'std:Database': { res: 'si si-database', style: IconStyle.SI },
//   'std:Mail': { res: 'si si-e-mail', style: IconStyle.SI },
//   'std:Page': { res: 'si si-end-page', style: IconStyle.SI },
//   'std:Trigger': { res: 'si si-trigger', style: IconStyle.SI },
//   'std:Program': { res: 'si si-program', style: IconStyle.SI },
//   'std:Manual': { res: 'si si-manual', style: IconStyle.SI },
//   'std:Receive': { res: 'si si-receive', style: IconStyle.SI },
//   'std:Rule': { res: 'si si-rule', style: IconStyle.SI },
//   'std:Send': { res: 'si si-send', style: IconStyle.SI },
//   'std:Service': { res: 'si si-service', style: IconStyle.SI },
//   'std:Script': { res: 'si si-script', style: IconStyle.SI },

//   'std:CallAndWait': { res: 'si si-wait', style: IconStyle.SI },
//   'std:SubEnd': { res: 'fa-solid fa-reply', style: IconStyle.FA },
//   'std:SubStart': { res: 'fa-solid fa-share', style: IconStyle.FA },
//   'std:Init': { res: 'fa-solid fa-arrow-right', style: IconStyle.FA },
//   'std:Method': { res: 'fa-solid fa-arrow-circle-right', style: IconStyle.FA },
//   'std:Event': { res: 'fa-solid fa-caret-square-right', style: IconStyle.FA },
//   'std:Exit': { res: 'fa-solid fa-window-close', style: IconStyle.FA },

//   'std:Signal': { res: 'si si-signal', style: IconStyle.SI },
//   'std:Error': { res: 'si si-error', style: IconStyle.SI },
//   'std:Alternative': { res: 'si si-aternative', style: IconStyle.SI },
//   'std:Join': { res: 'si si-join', style: IconStyle.SI },
//   'std:Split': { res: 'si si-split', style: IconStyle.SI },

//   'std:Tasks': { res: 'M5,5 m-4,0 a4,4 0 1,1 8,0 a4,4 0 1,1 -8,0 M3,5 L7,5 M5,3 L5,7', style: IconStyle.SVG },

//   // Error/Signal icons
//   'std:Message': { res: 'fa-regular fa-envelope', style: IconStyle.FA },
//   'std:Timer': { res: 'fa-regular fa-clock', style: IconStyle.FA },
//   'std:Conditional': { res: 'fa-solid fa-align-justify', style: IconStyle.FA },
//   'std:Escalation': { res: 'fa-solid fa-angles-up', style: IconStyle.FA },
//   'std:Compensation': { res: 'fa-solid fa-angles-left', style: IconStyle.FA },
//   'std:Cancel': { res: 'fa-solid fa-xmark', style: IconStyle.FA }
// };

export const resolveIcon = (iconUri: string): NodeIcon => {
  if (!iconUri) {
    return NoIcon;
  }
  if (iconUri.includes('/faces/javax.faces.resource')) {
    return { res: iconUri, style: IconStyle.IMG };
  } else if (iconUri.startsWith('ext:')) {
    return { res: 'fa-puzzle-piece', style: IconStyle.FA };
  }
  const elementIcon = ElementIcons.get(iconUri);
  return elementIcon ? { res: elementIcon, style: IconStyle.SI } : { res: iconUri, style: IconStyle.UNKNOWN };
};
