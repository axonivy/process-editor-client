export namespace EventStartTypes {
  export const DEFAULT = 'EVENT_START';
  export const START = DEFAULT + ':RequestStart';
  export const START_ERROR = DEFAULT + ':ErrorStartEvent';
  export const START_SIGNAL = DEFAULT + ':SignalStartEvent';
  export const START_PROGRAM = DEFAULT + ':ProgramStart';
  export const START_SUB = DEFAULT + ':CallSubStart';
  export const START_WS = DEFAULT + ':WebserviceStart';
  export const START_HD = DEFAULT + ':HtmlDialogStart';
  export const START_HD_METHOD = DEFAULT + ':HtmlDialogMethodStart';
  export const START_HD_EVENT = DEFAULT + ':HtmlDialogEventStart';
  export const START_EMBEDDED = DEFAULT + ':EmbeddedStart';
}

export namespace EventEndTypes {
  export const DEFAULT = 'EVENT_END';
  export const END = DEFAULT + ':TaskEnd';
  export const END_ERROR = DEFAULT + ':ErrorEnd';
  export const END_PAGE = DEFAULT + ':TaskEndPage';
  export const END_SUB = DEFAULT + ':CallSubEnd';
  export const END_WS = DEFAULT + ':WebserviceEnd';
  export const END_HD = DEFAULT + ':HtmlDialogEnd';
  export const END_HD_EXIT = DEFAULT + ':HtmlDialogExit';
  export const END_EMBEDDED = DEFAULT + ':EmbeddedEnd';
}

export namespace EventIntermediateTypes {
  export const DEFAULT = 'EVENT_INTERMEDIATE';
  export const INTERMEDIATE_TASK = DEFAULT + ':TaskSwitchEvent';
  export const INTERMEDIATE_WAIT = DEFAULT + ':WaitEvent';
}

export namespace EventBoundaryTypes {
  export const DEFAULT = 'EVENT_BOUNDARY';
  export const BOUNDARY_ERROR = DEFAULT + ':ErrorBoundaryEvent';
  export const BOUNDARY_SIGNAL = DEFAULT + ':SignalBoundaryEvent';
}

export namespace GatewayTypes {
  export const DEFAULT = 'GATEWAY';
  export const TASK = DEFAULT + ':TaskSwitchGateway';
  export const JOIN = DEFAULT + ':Join';
  export const SPLIT = DEFAULT + ':Split';
  export const ALTERNATIVE = DEFAULT + ':Alternative';
}

export namespace ActivityTypes {
  export const DEFAULT = 'ACTIVITY';
  export const COMMENT = DEFAULT + ':ProcessAnnotation';
  export const SCRIPT = DEFAULT + ':Script';
  export const HD = DEFAULT + ':DialogCall';
  export const USER = DEFAULT + ':UserTask';
  export const SOAP = DEFAULT + ':WebServiceCall';
  export const REST = DEFAULT + ':RestClientCall';
  export const DB = DEFAULT + ':Database';
  export const EMAIL = DEFAULT + ':EMail';
  export const SUB_PROCESS = DEFAULT + ':SubProcessCall';
  export const EMBEDDED_PROCESS = DEFAULT + ':EmbeddedProcessElement';
  export const WEB_PAGE = DEFAULT + ':WebPage';
  export const TRIGGER = DEFAULT + ':TriggerCall';
  export const PROGRAM = DEFAULT + ':ProgramInterface';
  export const BPMN_GENERIC = DEFAULT + ':GenericBpmnElement';
  export const BPMN_USER = DEFAULT + ':UserBpmnElement';
  export const BPMN_MANUAL = DEFAULT + ':ManualBpmnElement';
  export const BPMN_SCRIPT = DEFAULT + ':ScriptBpmnElement';
  export const BPMN_RECEIVE = DEFAULT + ':ReceiveBpmnElement';
  export const BPMN_RULE = DEFAULT + ':RuleBpmnElement';
  export const BPMN_SEND = DEFAULT + ':SendBpmnElement';
  export const BPMN_SERVICE = DEFAULT + ':ServiceBpmnElement';
  export const THIRD_PARTY = 'ThirdPartyProgramInterface';
  export const THIRD_PARTY_RULE = THIRD_PARTY + ':RuleActivity';
  export const LABEL = DEFAULT + '-label';
}

export namespace LaneTypes {
  export const DEFAULT = 'lanes';
  export const LANE = DEFAULT + ':lane';
  export const POOL = DEFAULT + ':pool';
  export const LABEL = DEFAULT + ':label';
}

export namespace EdgeTypes {
  export const DEFAULT = 'edge';
  export const ASSOCIATION = DEFAULT + ':association';
}

export namespace LabelType {
  export const DEFAULT = 'label';
}
