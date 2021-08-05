export namespace EventTypes {
  // Event elements
  export const DEFAULT = 'event';
  export const START = DEFAULT + ':start';
  export const START_ERROR = START + ':error';
  export const START_SIGNAL = START + ':signal';
  export const START_PROGRAM = START + ':program';
  export const START_SUB = START + ':sub';
  export const START_WS = START + ':ws';
  export const END = DEFAULT + ':end';
  export const END_ERROR = END + ':error';
  export const END_PAGE = END + ':page';
  export const END_SUB = END + ':sub';
  export const END_WS = END + ':ws';
  export const INTERMEDIATE = DEFAULT + ':intermediate';
  export const INTERMEDIATE_TASK = INTERMEDIATE + ':task';
  export const INTERMEDIATE_WAIT = INTERMEDIATE + ':wait';
  export const INTERMEDIATE_CALL_AND_WAIT = INTERMEDIATE + ':callandwait';
  export const BOUNDARY = DEFAULT + ':boundary';
  export const BOUNDARY_ERROR = BOUNDARY + ':error';
  export const BOUNDARY_SIGNAL = BOUNDARY + ':signal';
}

export namespace GatewayTypes {
  export const DEFAULT = 'gateway';
  export const TASK = DEFAULT + ':task';
  export const ALTERNATIVE = DEFAULT + ':alternative';
}

export namespace ActivityTypes {
  export const DEFAULT = 'node';
  export const COMMENT = DEFAULT + ':comment';
  export const SCRIPT = DEFAULT + ':script';
  export const HD = DEFAULT + ':hd';
  export const USER = DEFAULT + ':user';
  export const SOAP = DEFAULT + ':soap';
  export const REST = DEFAULT + ':rest';
  export const DB = DEFAULT + ':db';
  export const EMAIL = DEFAULT + ':email';
  export const SUB_PROCESS = DEFAULT + ':subproc';
  export const EMBEDDED_PROCESS = DEFAULT + ':embeddedproc';
  export const WEB_PAGE = DEFAULT + ':web';
  export const TRIGGER = DEFAULT + ':trigger';
  export const PROGRAMM = DEFAULT + ':program';
  export const THIRD_PARTY = DEFAULT + ':thirdparty';
  export const LABEL = DEFAULT + ':label';
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
