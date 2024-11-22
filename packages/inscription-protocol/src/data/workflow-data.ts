import type {
  IntermediateEventTimeoutAction,
  HttpMethod,
  QueryKind,
  WfActivatorType,
  WfFieldType,
  WfLevel,
  WsAuth,
  InputType,
  RoleMeta,
  VariableInfo,
  Variable
} from './inscription';

export const RESPONSIBLE_TYPE = {
  ROLE: 'Role',
  ROLE_FROM_ATTRIBUTE: 'Role from Attr.',
  USER_FROM_ATTRIBUTE: 'User from Attr.',
  DELETE_TASK: 'Nobody & delete'
} as const satisfies Record<WfActivatorType, string>;

export const PRIORITY_LEVEL = {
  LOW: 'Low',
  NORMAL: 'Normal',
  HIGH: 'High',
  EXCEPTION: 'Exception',
  SCRIPT: 'Script'
} as const satisfies Record<WfLevel, string>;

export const CUSTOM_FIELD_TYPE = {
  STRING: 'String',
  TEXT: 'Text',
  NUMBER: 'Number',
  TIMESTAMP: 'Timestamp'
} as const satisfies Record<WfFieldType, string>;

export const MAIL_TYPE = {
  plain: 'text/plain',
  html: 'text/html'
} as const;

export const IVY_EXCEPTIONS = {
  mail: 'ivy:error:email',
  security: 'ivy:security:forbidden',
  database: 'ivy:error:database',
  webservice: 'ivy:error:webservice:exception',
  rest: 'ivy:error:rest:client',
  ignoreException: '>> Ignore Exception',
  ignoreError: '>> Ignore error',
  programException: 'ivy:error:program:exception',
  programTimeout: 'ivy:error:program:timeout',
  intermediate: 'ivy:expiry:intermediate'
} as const;

export const QUERY_KIND = {
  READ: 'READ',
  WRITE: 'WRITE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  ANY: 'ANY'
} as const satisfies Record<QueryKind, QueryKind>;

export const QUERY_ORDER = {
  ASCENDING: 'ASCENDING',
  DESCENDING: 'DESCENDING'
} as const;

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  HEAD: 'HEAD',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  JAX_RS: 'JAX_RS'
} as const satisfies Record<HttpMethod, HttpMethod>;

export const REST_INPUT_TYPES = {
  ENTITY: 'Entity',
  FORM: 'Form',
  RAW: 'Raw'
} as const satisfies Record<InputType, string>;

export const REST_PARAM_KIND = {
  Query: 'Query',
  Path: 'Path'
} as const;

export const IVY_SCRIPT_TYPES = {
  ...CUSTOM_FIELD_TYPE,
  DURATION: 'Duration',
  TIME: 'Time',
  BOOLEAN: 'Boolean',
  INT: 'Integer',
  BPM_ERROR: 'ch.ivyteam.ivy.bpm.error.BpmError',
  OBJECT: 'Object'
} as const;

export const WS_AUTH_TYPE = {
  NONE: 'None/Container',
  WS_SECURITY: 'WS Security',
  HTTP_BASIC: 'HTTP Basic'
} as const satisfies Record<WsAuth, string>;

export const EVENT_ACTION_TYPE = {
  NOTHING: 'Do nothing',
  DESTROY_TASK: 'Delete the Task',
  CONTINUE_WITHOUT_EVENT: 'Continue without waiting'
} as const satisfies Record<IntermediateEventTimeoutAction, string>;

export const EMPTY_ROLE: RoleMeta = { id: 'Everybody', label: 'Everybody', children: [] as RoleMeta[] } as const;
export const EMPTY_VAR_INFO: VariableInfo = { types: {}, variables: [] as Variable[] } as const;
